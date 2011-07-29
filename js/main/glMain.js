
function GlMain(data) {
	this.textData = [];
	this.imageData = [];
	
	this.gl = null;
	this.glBase = null;
	
	this.colorShader = null;
	this.textureShader = null;

	this.matrixStack = null;
	this.camera = null;

	this.lightGeometry = null;
	this._lightPosition = null;
	this._currentLightPosition = null;
	
	this.objectGeometry = null;
	this.cubeTexture = null;
	
	this.currentRotation = 0;
	
	this.animationTimer = null;
	
	// Constructor
	{
		this.textData = data.textData;
		this.imageData = data.imageData;
	}
	
	this.start = function() {
		var canvas = document.getElementById("webgl-canvas");
		
		this.initGl(canvas);
		this.initShaders();
		this.initGeometry();
		this.initTextures();
		this.initLights();
		
	    this.matrixStack = new MatrixStack();
		this.initCamera();

	    this.startDrawLoop();	    
	    this.startAnimationTimer();
	}
	
	this.initGl = function(canvas) {
		this.glBase = new GlBase('webgl-canvas');
		this.glBase.init();
		this.gl = this.glBase.getGlContext();	
	}
	
	this.initShaders = function() {
		this.createColorShader();
		this.createTextureShader();
	}
	
	this.createColorShader = function() {
		this.colorShader = new Shader(this.gl);
		this.colorShader.createShader(this.textData.colorVertexShader, this.textData.colorFragmentShader);
			
		this.colorShader.bindVertexAttribute('vertexPosition', 'vertexPositionAttribute');
		this.colorShader.bindVertexAttribute('vertexColor', 'vertexColorAttribute');
			
		this.colorShader.bindUniformAttribute('modelViewMatrix', 'modelViewMatrixUniform');
		this.colorShader.bindUniformAttribute('projectionMatrix', 'projectionMatrixUniform');
	}
	
	this.createTextureShader = function() {
		this.textureShader = new Shader(this.gl);
		this.textureShader.createShader(this.textData.textureVertexShader, this.textData.textureFragmentShader);
		
		this.textureShader.bindVertexAttribute('vertexPosition', 'vertexPositionAttribute');
		this.textureShader.bindVertexAttribute('vertexTextureCoordinate', 'vertexTextureCoordinateAttribute');
		this.textureShader.bindVertexAttribute('vertexNormal', 'vertexNormalAttribute');
		
		this.textureShader.bindUniformAttribute('modelViewMatrix', 'modelViewMatrixUniform');
		this.textureShader.bindUniformAttribute('projectionMatrix', 'projectionMatrixUniform');
		this.textureShader.bindUniformAttribute('normalMatrix', 'normalMatrixUniform');
		this.textureShader.bindUniformAttribute('textureSampler', 'textureSamplerUniform');
		this.textureShader.bindUniformAttribute('lightPosition', 'lightPositionUniform')
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
		
		this.lightGeometry.bindVertexPositionUniformHandle('vertexPositionAttribute');
		this.lightGeometry.bindColorUniformHandle('vertexColorAttribute');
		
		//this.geometry2 = new TexturedCubeGeometry(this.gl, 1.0);
		this.objectGeometry = new SphereGeometry(this.gl, 1.0, 40, 40);
		
		this.objectGeometry.bindVertexPositionUniformHandle('vertexPositionAttribute');
		this.objectGeometry.bindTextureCoordinateUniformHandle(0, 'vertexTextureCoordinateAttribute');
		this.objectGeometry.bindNormalUniformHandle('vertexNormalAttribute');
	}
	
	this.initTextures = function() {
		this.cubeTexture = new Texture(this.gl);
		this.cubeTexture.create2DTexture(this.imageData.boxTextureImage, this.gl.LINEAR_MIPMAP_LINEAR, this.gl.LINEAR_MIPMAP_LINEAR);
	}
	
	this.initLights = function() {
		this._lightPosition = vec3.create([1.0, 1.0, 1.0]);
		this._currentLightPosition = vec3.create();
	}
	
	this.initCamera = function() {
		this.camera = new UserMovedCamera(this.matrixStack.modelViewMatrix, 'webgl-canvas');
		this.camera.bindUserInput();
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
		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		
		this.matrixStack.projectionMatrix.setPerspectiveProjection(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0);
		
		this.matrixStack.modelViewMatrix.pushMatrix();
		
			this.matrixStack.modelViewMatrix.translate(0.0, 0.0, -3.0);
			

			
			this.matrixStack.modelViewMatrix.pushMatrix();
				this.matrixStack.modelViewMatrix.rotate(this.currentRotation, 0.0, 1.0, 0.0);
				this.matrixStack.modelViewMatrix.translate(this._lightPosition[0], this._lightPosition[1], this._lightPosition[2]);

				
				var modelViewMatrix = this.matrixStack.modelViewMatrix.getMatrix();
				mat4.multiplyPoint3(modelViewMatrix, vec3.create(0.0, 0.0, 0.0), this._currentLightPosition);
				
				this.prepareColoredDraw();
				this.lightGeometry.drawOnce(this.colorShader.getShaderProgram());				
			this.matrixStack.modelViewMatrix.popMatrix();

			this.matrixStack.modelViewMatrix.pushMatrix();	
				this.matrixStack.modelViewMatrix.rotate(this.currentRotation, 1.0, 1.0, 1.0);
				this.prepareTexturedDraw();		
				this.objectGeometry.drawOnce(this.textureShader.getShaderProgram());	
			this.matrixStack.modelViewMatrix.popMatrix();
			
		this.matrixStack.modelViewMatrix.popMatrix();
		
		//throw("done");
	}
	
	this.prepareColoredDraw = function() {
		this.colorShader.use();
		this.colorShader.setUniformMatrix4('projectionMatrixUniform', this.matrixStack.projectionMatrix.getMatrix());
		this.colorShader.setUniformMatrix4('modelViewMatrixUniform', this.matrixStack.modelViewMatrix.getMatrix());
	}
	
	this.prepareTexturedDraw = function() {
		this.textureShader.use();
		this.textureShader.setUniformMatrix4('projectionMatrixUniform', this.matrixStack.projectionMatrix.getMatrix());
		this.textureShader.setUniformMatrix4('modelViewMatrixUniform', this.matrixStack.modelViewMatrix.getMatrix());
		this.textureShader.setUniformMatrix3('normalMatrixUniform', this.matrixStack.modelViewMatrix.getNormalMatrix());
		
		this.textureShader.setUniform1i('textureSamplerUniform', 0);
		this.textureShader.setUniform3f('lightPositionUniform', this._currentLightPosition[0], this._currentLightPosition[1], this._currentLightPosition[2])
		
		this.cubeTexture.use();
	}	
}
