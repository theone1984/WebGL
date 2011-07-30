
function MatrixStack() {
	ShaderHandler.apply(this, []);
	
	this.modelViewMatrix = null;
	this.projectionMatrix = null;
	
	// Constructor
	{
		this.modelViewMatrix = new ModelViewMatrix();
		this.projectionMatrix = new ProjectionMatrix();		
	}
	
	this.bindShaderAttributes = function(shader, projectionMatrixUniform, modelViewMatrixUniform, normalMatrixUniform) {
		this._addShaderHandles(shader, {
			projectionMatrix: shader.getUniformHandle(projectionMatrixUniform),
			modelViewMatrix: shader.getUniformHandle(modelViewMatrixUniform),
			normalMatrix: shader.getUniformHandle(normalMatrixUniform)
		});
	}
	
	this.setShaderAttributes = function(activeShader) {
		var shaderHandles = this._getShaderHandles(activeShader);
		
		if (shaderHandles.projectionMatrix != null)
			activeShader.setUniformMatrix4(shaderHandles.projectionMatrix, this.projectionMatrix.getMatrix());
		if (shaderHandles.modelViewMatrix != null)
			activeShader.setUniformMatrix4(shaderHandles.modelViewMatrix, this.modelViewMatrix.getMatrix());
		if (shaderHandles.normalMatrix != null)
			activeShader.setUniformMatrix3(shaderHandles.normalMatrix, this.modelViewMatrix.getNormalMatrix());
	}
}