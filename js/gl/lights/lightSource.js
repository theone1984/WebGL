
function LightSource(modelViewMatrix, color, ambientFactor, diffuseFactor, specularFactor) {
	ShaderHandler.apply(this, []);
	
	this._modelViewMatrix = null;
	
	this._currentLightPosition = vec3.create();
	
	this._color = null;	
	this._ambientFactor = 0.0;
	this._diffuseFactor = 0.0;
	this._specularFactor = 0.0;
	
	this.bindShaderAttributes = function(shader, lightPositionUniform, lightColorUniform, ambientFactorUniform, diffuseFactorUniform, specularFactorUniform) {
		this._addShaderHandles(shader, {
			lightPosition: shader.getUniformHandle(lightPositionUniform),
			lightColor: shader.getUniformHandle(lightColorUniform),
			ambientFactor: shader.getUniformHandle(ambientFactorUniform),
			diffuseFactor: shader.getUniformHandle(diffuseFactorUniform),
			specularFactor: shader.getUniformHandle(specularFactorUniform)
		});
		
		this.setShaderAttributes(shader);
	}
	
	this.setShaderAttributes = function(activeShader) {
		var shaderHandles = this._getShaderHandles(activeShader);
		
		if (shaderHandles.lightColor != null)
			activeShader.setUniform3f(shaderHandles.lightColor, this._color);
		
		if (shaderHandles.ambientFactor != null)
			activeShader.setUniform1f(shaderHandles.ambientFactor, this._ambientFactor);
		if (shaderHandles.diffuseFactor != null)
			activeShader.setUniform1f(shaderHandles.diffuseFactor, this._diffuseFactor);
		if (shaderHandles.specularFactor != null)
			activeShader.setUniform1f(shaderHandles.specularFactor, this._specularFactor);
		
		this.setShaderLightPosition(activeShader, shaderHandles);
	}
	
	this.saveCurrentLightPosition = function() {
		var currentModelViewMatrix = this._modelViewMatrix.getMatrix();
		
		mat4.multiplyPoint3(currentModelViewMatrix, vec3.create(0.0, 0.0, 0.0), this._currentLightPosition);
	}
	
	this.setShaderLightPosition = function(activeShader) {
		var shaderHandles = this._getShaderHandles(activeShader);	
		
		if (shaderHandles.lightPosition != null)
			activeShader.setUniform3f(shaderHandles.lightPosition, this._currentLightPosition);
	}
	
	// Constructor
	{
		this._modelViewMatrix = modelViewMatrix;
		
		this._color = vec3.create(color);
		
		this._ambientFactor = ambientFactor;
		this._diffuseFactor = diffuseFactor;
		this._specularFactor = specularFactor;
	}
}