
function GlBase(canvasId) {
	this._canvasId = canvasId;
	
	this._canvas = null;
	this._glContext = null;
	
	this.init = function() {
		this._canvas = document.getElementById(this._canvasId);
		
		this._createContext();
		this._initGl();
	}
	
	this._createContext = function() {
		try {
			this._glContext = this._canvas.getContext("experimental-webgl");

			this._glContext.viewportWidth = this._canvas.width;
			this._glContext.viewportHeight = this._canvas.height;
		} catch(e) { }
		
		if (!this._glContext) {
			alert("Could not initialize WebGL");
		}
	}
	
	this._initGl = function() {
		this._glContext.clearColor(0.0, 0.0, 0.0, 1.0);
		this._glContext.clearDepth(1.0);
		this._glContext.enable(this._glContext.DEPTH_TEST);
		this._glContext.depthFunc(this._glContext.LEQUAL);
	}
	
	this.getGlContext = function() {
		return this._glContext;
	}
	
	this.startDrawLoop = function(drawSceneCallback) {
		this._executeDrawLoop(drawSceneCallback)
	}
	
	this._executeDrawLoop = function(drawSceneCallback) {
		var that = this;

		try {
			this._draw(drawSceneCallback);
		} catch(e) {
			console.error(e.stack);			
			return;
		}
		
		requestAnimFrame(function() { that._executeDrawLoop(drawSceneCallback); });
	}
	
	this._draw = function(drawSceneCallback) {
		this._glContext.viewport(0, 0, this._glContext.viewportWidth, this._glContext.viewportHeight);
		this._glContext.clear(this._glContext.COLOR_BUFFER_BIT | this._glContext.DEPTH_BUFFER_BIT);

		drawSceneCallback.call();
	}
	
}