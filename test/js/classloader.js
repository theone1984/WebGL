
var classloader = (function() {
	var logger = getLogger("classloader");

	var classLoadState = {
		LOADING: 0,
		LOADING_DEPENDENT_CLASSES: 1,
		LOADED: 2,
		TIMEOUT_FAILURE: 3,
		OTHER_FAILURE: 4
	}
	
	var WAIT_SEPARATOR = 'wait';
	
	var baseDirectory = null;

	var classLoadStates = {};
	var updateHandlers = {};
	
	var activeClassLoaders = [];
	
	function getLogger(qualifiedClassName) {
		var consoleAppender = new log4javascript.BrowserConsoleAppender();
		consoleAppender.setLayout(new log4javascript.PatternLayout("[%-5p] %c:   %m"));
		
		var newLogger = log4javascript.getLogger(qualifiedClassName);
		newLogger.setAdditivity(false);
		newLogger.setLevel(log4javascript.Level.DEBUG);
		newLogger.addAppender(consoleAppender);
		
		return newLogger;
	}
	
	function loadClass(qualifiedClassName, updateHandler) {
		logger.debug("Attempting to load class '" + qualifiedClassName + "'");		

		var loadState = classLoadStates[qualifiedClassName]
		
		if (loadState === undefined) {
			logger.debug("Class '" + qualifiedClassName + "' needs to be loaded anew.");
			
			loadClassAnew(qualifiedClassName);			
			addUpdateHandler(qualifiedClassName, updateHandler);
		} else if (loadState !== classLoadState.LOADING &&
				   loadState !== classLoadState.LOADING_DEPENDENT_CLASSES) {
			logger.debug("Loading of class '" + qualifiedClassName + "' has already been finished.");
			
			updateHandler.call(this, qualifiedClassName, loadState);
		} else {
			logger.debug("Loading of class '" + qualifiedClassName + "' has already been started.");
			
			addUpdateHandler(qualifiedClassName, updateHandler);
		}
	}
	
	function addUpdateHandler(qualifiedClassName, updateHandler) {
		if (updateHandlers[qualifiedClassName] === undefined) {
			updateHandlers[qualifiedClassName] = [updateHandler];
		} else {
			updateHandlers[qualifiedClassName].push(updateHandler);
		}
	}
	
	function loadClassAnew(qualifiedClassName) {
		classLoadStates[qualifiedClassName] = classLoadState.LOADING;
		createScriptTagFor(qualifiedClassName);
	}
	
	function createScriptTagFor(qualifiedClassName) {
		var fileName = getFileNameFor(qualifiedClassName);		
		logger.debug("Creating script tag for class '" + qualifiedClassName + "': '" + fileName + "'");
		
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.async = true;
		script.defer = true;
		
		script.addEventListener('load', function() { notifyWhenClassLoaded(qualifiedClassName); }, true);
		script.addEventListener('error', function() { notifyWhenClassLoadError(qualifiedClassName); }, true);
		
		script.src = fileName;
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	
	function getFileNameFor(qualifiedClassName) {
		var fileNameParts = qualifiedClassName.split('.');
		
		var fileName = baseDirectory;		
		for (var i = 0; i < fileNameParts.length; i++) {
			fileName += "/" + fileNameParts[i];
		}
		fileName += ".js";
		
		return fileName;
	}
	
	function notifyWhenClassLoaded(qualifiedClassName) {
		var loadState = classLoadState.LOADED;
		if (areDependentClassLoadersActive(qualifiedClassName)) {
			loadState = classLoadState.LOADING_DEPENDENT_CLASSES;
		}
		
		logger.debug("Class '" + qualifiedClassName + "' has been loaded.");
		
		classLoadStates[qualifiedClassName] = loadState;		
		callUpdateHandlers(qualifiedClassName, loadState);
	}
	
	function notifyWhenClassLoadError(qualifiedClassName) {
		logger.debug("Class '" + qualifiedClassName + "' could NOT be loaded successfully.");		
		classLoadStates[qualifiedClassName] = classLoadState.OTHER_FAILURE;
		
		callUpdateHandlers(qualifiedClassName, classLoadState.OTHER_FAILURE);
	}
	
	function areDependentClassLoadersActive(qualifiedClassName) {
		for (var i = 0; i < activeClassLoaders.length; i++) {
			if (activeClassLoaders[i] === qualifiedClassName) {
				return true;
			}
		}
		
		return false;
	}
	
	function callUpdateHandlers(qualifiedClassName, loadState) {
		logger.debug("Invoking update handlers with state '" + loadState + "' for class '" + qualifiedClassName + "'");
		var handlers = updateHandlers[qualifiedClassName];
		
		if (loadState >= classLoadState.LOADED) {
			logger.debug("Deleting update handlers for class '" + qualifiedClassName + "'");
			delete updateHandlers[qualifiedClassName];
		}
		
		for (var i = 0; i < handlers.length; i++) {
			handlers[i].call(this, qualifiedClassName, loadState);
		}
	}
	
	function registerClassLoader(qualifiedClassName) {
		logger.debug("Registering class loader for class '" + qualifiedClassName + "'");
		
		for (var i = 0; i < activeClassLoaders.length; i++) {
			if (activeClassLoaders[i] === qualifiedClassName) {
				return;
			}
		}
		activeClassLoaders.push(qualifiedClassName);		
	}
	
	function unregisterClassLoader(qualifiedClassName) {
		logger.debug("Unregistering class loader for class '" + qualifiedClassName + "'");
		
		var removed = false;
		for (var i = 0; i < activeClassLoaders.length; i++) {
			if (activeClassLoaders[i] === qualifiedClassName) {
				activeClassLoaders.splice(i, 1);
				removed = true;
				break;
			}
		}
		
		if (removed) {
			updateStateOfWaitingClassLoaders(qualifiedClassName);
		}
	}
	
	function updateStateOfWaitingClassLoaders(qualifiedClassName) {
		if (classLoadStates[qualifiedClassName] == classLoadState.LOADING_DEPENDENT_CLASSES) {
			classLoadStates[qualifiedClassName] = classLoadState.LOADED;
			callUpdateHandlers(qualifiedClassName, classLoadState.LOADED);
		}
	}
	
	function assignClassToPackage(packageName, className, constructorFunction) {
		logger.debug("Assigning class '" + className + "' to package '" + packageName + "'");
		
		var currentPackage = window;
		var packageModules = packageName.split('.');
		for (var i = 0; i < packageModules.length; i++) {
			if (currentPackage[packageModules[i]] === undefined) {
				currentPackage[packageModules[i]] = {};
			}
			
			currentPackage = currentPackage[packageModules[i]];	
		}
		
		currentPackage[className] = constructorFunction;
	}

	function setBaseDirectory(directory) {
		if (baseDirectory !== null) {
			throw new Error('The base directory has already been set');
		}
		
		baseDirectory = directory;
		
		logger.debug("Setting base directory to " + baseDirectory);
	}
	
	function getBaseDirectory() {
		return baseDirectory === null ? '' : baseDirectory;
	}
	
	function package(packageName, className) {
		var logger = null;
		
		var that = null;
		var classesToLoad = [];
		
		var loading = false;
		
		var classConstructor = null;
		var finishCallback = null;
		
		var qualifiedName = null;
		
		function import(qualifiedClassName) {
			logger.debug("Import of class '" + qualifiedClassName + "' ordered");
			classesToLoad.push(qualifiedClassName);
			
			return that;
		}
		
		function class(constructor) {
			checkIfLoading();
			loading = true;
			
			classConstructor = constructor;
			
			startLoadingClasses();					
		}
		
		function execute(callbackFunction) {
			checkIfLoading();
			loading = true;
			
			finishCallback = callbackFunction;
			
			startLoadingClasses();
		}
		
		function checkIfLoading() {
			if (loading) {
				throw new Error("The finish method was already called before");
			}
		}
		
		function startLoadingClasses() {
			registerClassLoader(qualifiedName);
			
			logger.debug("Starting to load classes");
			
			if (classesToLoad.length === 0) {
				notifyWhenAllClassesLoaded();
			}
			
			for (var i = 0; i < classesToLoad.length; i++) {
				loadClass(classesToLoad[i], notifyWhenClassUpdate);
			}
		}
		
		function notifyWhenClassUpdate(qualifiedClassName, loadState) {
			if (loadState == classLoadState.LOADED) {
				removeClassNameFromClassLoadList(qualifiedClassName);	
				logger.debug("Class '" + qualifiedClassName + "' has been loaded (" + classesToLoad.length + " class/es to go)");
			}
			
			if (classesToLoad.length === 0) {
				notifyWhenAllClassesLoaded();
			}
		}
		
		function removeClassNameFromClassLoadList(qualifiedClassName) {
			for (var i = 0; i < classesToLoad.length; i++) {
				if (classesToLoad[i] === qualifiedClassName) {
					classesToLoad.splice(i, 1);
					return;
				}
			}
		}
		
		function notifyWhenAllClassesLoaded() {
			logger.debug("All classes were loaded successfully");
			
			if(classConstructor != null) {
				assignClassToPackage(packageName, className, classConstructor);
			}
			
			unregisterClassLoader(qualifiedName);

			if (finishCallback !== null) {
				callFinishCallback();

			}
		}
		
		function callFinishCallback() {
			logger.debug("Executing script");
			finishCallback.call(this);
		}
		
		that = {
			'import': import,
			'class': class,
			'execute': execute,
			'setBaseDirectory': setBaseDirectory
		}
		
		// Constructor
		{
			determineQualifiedName();
			logger = getLogger(qualifiedName);
			
			logger.debug("Starting to work for class '" + qualifiedName + "'");
		}
		
		function determineQualifiedName() {
			if (packageName === undefined && className === undefined) {
				packageName = null;
				className = "main";
			}
			
			if (packageName === null) {
				qualifiedName = className;
			} else {
				qualifiedName = packageName + "." + className;
			}
		}		
		
		return that;
	}
	
	return {
		'package': package,
		'setBaseDirectory': setBaseDirectory,
		'getBaseDirectory': getBaseDirectory
	};	
})();