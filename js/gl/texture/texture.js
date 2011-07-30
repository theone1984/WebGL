
this.Texture = function(glContext) {
	ShaderHandler.apply(this, []);
	
	this._glContext = glContext;
	this._textureHandle = null;
	
	this.create2DTexture = function(image, magnificationFilterMode, minificationFilterMode) {
		var gl = this._glContext;
		
		var textureHandle = gl.createTexture();		
		gl.bindTexture(gl.TEXTURE_2D, textureHandle);
		
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);	    
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	    
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magnificationFilterMode);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minificationFilterMode);
	    
	    if (minificationFilterMode == gl.NEAREST_MIPMAP_NEAREST || minificationFilterMode == gl.LINEAR_MIPMAP_NEAREST ||
	    	minificationFilterMode == gl.NEAREST_MIPMAP_LINEAR || minificationFilterMode == gl.LINEAR_MIPMAP_LINEAR) {
	    	
	    	gl.generateMipmap(gl.TEXTURE_2D);
	    }
	    
	    gl.bindTexture(gl.TEXTURE_2D, null);
	    
	    this._textureHandle = textureHandle;
	}
	
	this.bindShaderAttributes = function(shader, samplerUniform) {
		this._addShaderHandles(shader, {
			sampler: shader.getUniformHandle(samplerUniform)
		});
	}
	
	this.use = function(activeShader, textureLevel) {
		var shaderHandles = this._getShaderHandles(activeShader);
		
		this._bindTexture(textureLevel)
		this._setShaderAttributes(activeShader, shaderHandles, textureLevel);
	}
	
	this._bindTexture = function(textureLevel) {
		var gl = this._glContext;
		var textureHandle = this._textureHandle;
		
		gl.activeTexture(gl.TEXTURE0 + textureLevel);
	    gl.bindTexture(gl.TEXTURE_2D, textureHandle);
	}
	
	this._setShaderAttributes = function(shader, shaderHandles, textureLevel) {
		if (shaderHandles.sampler != null)
			shader.setUniform1i(shaderHandles.sampler, textureLevel);
	}
}