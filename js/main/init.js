
var init = new Initializer();

function Initializer() {
	this.scriptsToLoad = [
	    '../js/lib/gl/glMatrix.min.js',
	    '../js/lib/gl/webgl-utils.js',
	    '../js/utility/timer.js',
	    '../js/gl/geometry/arrayBasedGeometry.js',
	    '../js/gl/geometry/objects/pyramidGeometry.js',
	    '../js/gl/geometry/objects/cubeGeometry.js',
	    '../js/gl/geometry/objects/coloredCubeGeometry.js',
	    '../js/gl/geometry/objects/texturedCubeGeometry.js',
	    '../js/gl/texture/texture.js',
	    '../js/gl/matrix/matrixStack.js',
	    '../js/gl/glBase.js',
	    '../js/gl/shader.js',
	    '../js/main/glMain.js'
	];
	
	this.textsToLoad = {
		'colorFragmentShader':		'../shaders/color-fragment-shader.fp',
	    'colorVertexShader': 		'../shaders/color-vertex-shader.vp',
		'textureFragmentShader':	'../shaders/texture-fragment-shader.fp',
	    'textureVertexShader':	 	'../shaders/texture-vertex-shader.vp',
	};
	
	this.imagesToLoad = {
		'boxTextureImage':			'../img/box.jpg',
	};
	
	this.start = function() {
		var that = this;
		$.getScripts(this.scriptsToLoad, function() { that.scriptsLoaded(); });
	}
	
	this.scriptsLoaded = function() {
		var that = this;
		$.loadTexts(this.textsToLoad, function(data) { that.textsLoaded(data) });
	}
	
	this.textsLoaded = function(textData) {
		var that = this;
		$.loadImages(this.imagesToLoad, function(imageData) { that.imagesLoaded(textData, imageData) });
	}	
	
	this.imagesLoaded = function(textData, imageData) {
		var data = {
			'textData': textData,
			'imageData': imageData
		};
		
		this.startApplication(data);
	}
	
	this.startApplication = function(data) {
		var glMain = new GlMain(data);
		glMain.start();
	}
}