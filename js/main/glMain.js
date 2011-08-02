
function GlMain(data) {
	this.textData = [];
	this.imageData = [];
	
	this.gl = null;
	this.glBase = null;
	
	this.colorShader = null;
	this.textureShader = null;

	this.matrixStack = null;
	this.camera = null;
	
	this.lightSource = null;

	this.lightGeometry = null;
	this.lightPosition = null;	
	this.objectGeometry = null;
	
	this.objectTexture = null;
	this.objectNormalTexture = null;
	
	this.currentRotation = 0;
	
	this.animationTimer = null;
	this.fpsCounter = null;
	
	// Constructor
	{
		this.textData = data.textData;
		this.imageData = data.imageData;
		
		this.fpsCounter = new GraphicalFpsCounter('framecount-canvas', 3, 60);
		this.fpsCounter.start();
	}
	
	this.start = function() {
		var canvas = document.getElementById("webgl-canvas");
		
		this.initGl(canvas);
		this.initShaders();

		
		this.initGeometry();
		this.initTextures();
		this.initMatrixStack();		
		this.initCamera();

		this.initLights();
		
	    this.startDrawLoop();	    
	    this.startAnimationTimer();
	}
	
	this.initGl = function(canvas) {
		this.glBase = new GlBase('webgl-canvas');
		this.glBase.init();
		this.gl = this.glBase.getGlContext();	
	}
	
	this.initShaders = function() {
		this.colorShader = new Shader(this.gl, "colorShader");
		this.colorShader.createShader(this.textData.colorVertexShader, this.textData.colorFragmentShader);
		
		this.textureShader = new Shader(this.gl, "textureShader");
		this.textureShader.createShader(this.textData.textureVertexShader, this.textData.textureFragmentShader);
	}
	
	this.initGeometry = function() {
		this.lightGeometry = new ColoredCubeGeometry(this.gl, 0.1, [
            [ 1.0, 1.0, 1.0, 1.0 ],
            [ 1.0, 1.0, 1.0, 1.0 ],
	        [ 1.0, 1.0, 1.0, 1.0 ],
	        [ 1.0, 1.0, 1.0, 1.0 ],
	        [ 1.0, 1.0, 1.0, 1.0 ],
	        [ 1.0, 1.0, 1.0, 1.0 ]
		]);
		this.lightGeometry.bindShaderAttributes(this.colorShader, 'vertexPosition', null, null, 'vertexColor', null);
		
		this.objectGeometry = new SphereGeometry(this.gl, 1.0, 40, 40);
		this.objectGeometry.bindShaderAttributes(this.textureShader, 'vertexPosition_Object', 'vertexNormal_Object', 'vertexTangent_Object', 'vertexColor', ['vertexTextureCoordinate']);
	}
	
	this.initTextures = function() {
		this.objectTexture = new Texture(this.gl);
		this.objectTexture.create2DTexture(this.imageData.brickTextureImage, this.gl.LINEAR, this.gl.LINEAR_MIPMAP_LINEAR);
		this.objectTexture.bindShaderAttributes(this.textureShader, 'textureSampler');
		
		this.objectNormalTexture = new Texture(this.gl);
		this.objectNormalTexture.create2DTexture(this.imageData.brickNormalImage, this.gl.LINEAR, this.gl.LINEAR_MIPMAP_LINEAR);
		this.objectNormalTexture.bindShaderAttributes(this.textureShader, 'normalSampler');
	}
	
	this.initMatrixStack = function() {
	    this.matrixStack = new MatrixStack();
	    this.matrixStack.bindShaderAttributes(this.colorShader, 'projectionMatrix', 'modelViewMatrix', null, null);
	    this.matrixStack.bindShaderAttributes(this.textureShader, 'projectionMatrix', 'modelViewMatrix', 'normalMatrix', 'inverseModelViewMatrix');
	}
	
	this.initCamera = function() {
		this.camera = new UserMovedCamera(this.matrixStack.modelViewMatrix, 'webgl-canvas');
		this.camera.bindUserInput();
	}
	
	this.initLights = function() {
		this.lightPosition = vec3.create([1.0, 1.0, 1.0]);
		
		this.lightSource = new LightSource(this.matrixStack.modelViewMatrix, [1.0, 1.0, 1.0], 0.2, 0.5, 0.3);		
		this.lightSource.bindShaderAttributes(this.textureShader, 'lightPosition_World', 'lightColor', 'ambientFactor', 'diffuseFactor', 'specularFactor');
	}
	
	this.startAnimationTimer = function() {
		var that = this;
		
		this.animationTimer = new Timer(function() { that.animate(); }, 50);
		this.animationTimer.start();
	}
	
	this.startDrawLoop = function() {
		var that = this;
		this.glBase.startDrawLoop(function() { that.drawScene(); });
	}
	
	this.animate = function() {
		var elapsedTime = this.animationTimer.getElapsedTime();
		this.currentRotation = elapsedTime / 5000.0 * 360.0;
	}
	
	this.drawScene = function() {
		this.fpsCounter.increment();
		
		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		
		this.matrixStack.projectionMatrix.setPerspectiveProjection(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0);
		
		this.matrixStack.modelViewMatrix.pushMatrix();
		
			this.matrixStack.modelViewMatrix.translate(0.0, 0.0, -3.0);

			this.matrixStack.modelViewMatrix.pushMatrix();
			
				this.matrixStack.modelViewMatrix.rotate(this.currentRotation, 0.0, 1.0, 0.0);
				this.matrixStack.modelViewMatrix.translate(this.lightPosition[0], this.lightPosition[1], this.lightPosition[2]);
				
				this.lightSource.saveCurrentLightPosition();
				this.prepareColoredDraw();

				this.lightGeometry.drawOnce(this.colorShader);
			this.matrixStack.modelViewMatrix.popMatrix();
			
			this.matrixStack.modelViewMatrix.pushMatrix();
			
				this.matrixStack.modelViewMatrix.rotate(this.currentRotation, 1.0, -1.0, 1.0);
			
				this.prepareTexturedDraw();		
				this.objectGeometry.drawOnce(this.textureShader);
				
			this.matrixStack.modelViewMatrix.popMatrix();
			
		this.matrixStack.modelViewMatrix.popMatrix();
		
		//throw("done");
	}
	
	this.prepareColoredDraw = function() {
		var shader = this.colorShader;
		shader.use();
		
		this.matrixStack.setShaderAttributes(shader);
	}
	
	this.prepareTexturedDraw = function() {
		var shader = this.textureShader;
		shader.use();
		
		this.matrixStack.setShaderAttributes(shader);
		this.lightSource.setShaderLightPosition(shader);
		this.objectTexture.use(shader, 0);
		this.objectNormalTexture.use(shader, 1);
	}	
}