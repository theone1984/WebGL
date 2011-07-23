
function GlMain(data) {
	this.data = [];
	
	this.gl = null;
	this.glBase = null;
	this.shaderManager = null;

	this.matrixStack = null;

	this.pyramidGeometry = null;
	this.cubeGeometry = null;
	this.currentRotation = 0;
	
	this.animationTimer = null;
	
	// Constructor
	{
		this.data = data;
		
		if (this.data['fragmentShader'] == undefined || this.data['vertexShader'] == undefined) {
			throw new Error('Vertex and fragment shader must be given');
		}
	}
	
	this.start = function() {
		var canvas = document.getElementById("webgl-canvas");
		
		this.initGl(canvas);
		this.initShaders();
		this.initGeometry();
	    this.matrixStack = new MatrixStack();

	    this.startDrawLoop();	    
	    this.startAnimationTimer();
	}
	
	this.initGl = function(canvas) {
		this.glBase = new GlBase('webgl-canvas');
		this.glBase.init();
		this.gl = this.glBase.getGlContext();	
	}
	
	this.initShaders = function() {
		this.shaderManager = new ShaderManager(this.gl);
		this.shaderManager.createShaders(this.data['vertexShader'], this.data['fragmentShader']);
			
		this.shaderManager.bindVertexAttribute('vertexPosition', 'vertexPositionAttribute');
		this.shaderManager.bindVertexAttribute('vertexColor', 'vertexColorAttribute');
			
		this.shaderManager.bindUniformAttribute('modelViewMatrix', 'modelViewMatrixUniform');
		this.shaderManager.bindUniformAttribute('projectionMatrix', 'projectionMatrixUniform');
	}
	
	this.initGeometry = function() {
		this.pyramidGeometry = new PyramidGeometry(this.gl, 1.0, [
            [ 1.0, 0.0, 0.0, 1.0 ],	// Front face
            [ 0.0, 1.0, 0.0, 1.0 ], // Right face
	        [ 0.0, 0.0, 1.0, 1.0 ],	// Back face
	        [ 0.5, 0.5, 0.5, 1.0 ]	// Left face
		]);
		
		this.cubeGeometry = new CubeGeometry(this.gl, 1.0, [
       	    [1.0, 0.0, 0.0, 1.0], // Front face color
       	    [1.0, 1.0, 0.0, 1.0], // Back face color
			[0.0, 1.0, 0.0, 1.0], // Top face color
			[1.0, 0.5, 0.5, 1.0], // Bottom face color
			[1.0, 0.0, 1.0, 1.0], // Right face color
			[0.0, 0.0, 1.0, 1.0]  // Left face color
		]);
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
		
		this.matrixStack.setPerspectiveProjection(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0);
		
		this.matrixStack.pushMatrix();
		
			this.matrixStack.translate(-1.5, 0.0, -7.0);
			
			this.matrixStack.pushMatrix();
			
				this.matrixStack.rotate(this.currentRotation, 0.0, 1.0, 0.0);	
				this.setMatrixUniforms();
				
				this.pyramidGeometry.drawOnce(this.shaderManager.getShaderProgram(), 'vertexPositionAttribute', 'vertexColorAttribute');
				
			this.matrixStack.popMatrix();
			
			this.matrixStack.translate(2.5, 0.0, 0.0);
			
			this.matrixStack.pushMatrix();
				this.matrixStack.rotate(this.currentRotation, 1.0, 1.0, 1.0);
				this.setMatrixUniforms();
				
				this.cubeGeometry.drawOnce(this.shaderManager.getShaderProgram(), 'vertexPositionAttribute', 'vertexColorAttribute');
			
			this.matrixStack.popMatrix();
		this.matrixStack.popMatrix();
		
		//throw("done");
	}
	
	this.setMatrixUniforms = function() {
		this.shaderManager.setUniformMatrix4('projectionMatrixUniform', this.matrixStack.getProjectionMatrix());
		this.shaderManager.setUniformMatrix4('modelViewMatrixUniform', this.matrixStack.getModelViewMatrix());
	}	
}
