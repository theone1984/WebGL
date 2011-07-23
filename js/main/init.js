
var init = new Initializer();

function Initializer() {
	this.scriptsToLoad = [
	    '../js/lib/gl/glMatrix.min.js',
	    '../js/lib/gl/webgl-utils.js',
	    '../js/utility/timer.js',
	    '../js/gl/geometry/arrayBasedGeometry.js',
	    '../js/gl/geometry/objects/pyramidGeometry.js',
	    '../js/gl/geometry/objects/cubeGeometry.js',
	    '../js/gl/matrix/matrixStack.js',
	    '../js/gl/glBase.js',
	    '../js/gl/shaderManager.js',
	    '../js/main/glMain.js'
	];
	
	this.dataToLoad = {
		'fragmentShader':	'../shaders/fragment-shader.fp',
	    'vertexShader': 	'../shaders/vertex-shader.vp'
	};
	
	this.start = function() {
		var that = this;
		$.getScripts(this.scriptsToLoad, function() { that.scriptsLoaded(); });
	}
	
	this.scriptsLoaded = function() {
		var that = this;
		$.loadData(this.dataToLoad, function(data) { that.dataLoaded(data) });
	}
	
	this.dataLoaded = function(data) {
		this.startApplication(data);
	}
	
	this.startApplication = function(data) {
		var glMain = new GlMain(data);
		glMain.start();
	}
}