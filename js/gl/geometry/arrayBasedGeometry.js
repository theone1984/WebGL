
function ArrayBasedGeometry(glContext, primitiveType) {
	ShaderHandler.apply(this, []);
	
	this._glContext = glContext;
	this._primitiveType = primitiveType;
	
	this._vertexPositionBuffer = null;	
	this._normalBuffer = null;
	this._colorBuffer = null;
	this._textureCoordinateBuffers = [];
	
	this._indexBuffer = null;	
	this._indexed = false;
	
	this.bindShaderAttributes = function(shader, vertexPositionAttribute, normalAttribute, colorAttribute, textureCoordinateAttributes) {
		this._addShaderHandles(shader, {
			vertexPosition: shader.getVertexAttributeHandle(vertexPositionAttribute),
			normal: shader.getVertexAttributeHandle(normalAttribute),
			color: shader.getVertexAttributeHandle(colorAttribute),
			textureCoordinates: shader.getVertexAttributeHandles(textureCoordinateAttributes)
		});
	}
	
	this.setVertexPositionData = function(vertexData) {
		if (this._vertexPositionBuffer == null)
			this._vertexPositionBuffer = this._glContext.createBuffer();
		
		this._setArrayBufferData(this._vertexPositionBuffer, vertexData, 3);
	}
	
	this.setNormalData = function(normalData) {
		if (this._normalBuffer == null)
			this._normalBuffer = this._glContext.createBuffer();
		
		this._setArrayBufferData(this._normalBuffer, normalData, 3);
	}
	
	this.setColorData = function(colorData) {
		if (this._colorBuffer == null)
			this._colorBuffer = this._glContext.createBuffer();
		
		this._setArrayBufferData(this._colorBuffer, colorData, 4);
	}
	
	this.set2DTextureCoordinateData = function(textureLevel, textureCoordinateData) {
		if (this._textureCoordinateBuffers[textureLevel] == undefined ||
			this._textureCoordinateBuffers[textureLevel] == null) {
			this._textureCoordinateBuffers[textureLevel] = this._glContext.createBuffer();
		}
		
		this._setArrayBufferData(this._textureCoordinateBuffers[textureLevel], textureCoordinateData, 2);
	}
	
	this.setIndexData = function(indexData) {
		if (this._indexBuffer == null) {
			this._indexBuffer = this._glContext.createBuffer();
			this._indexed = true;
		}
		
		this._setIndexBufferData(this._indexBuffer, indexData);
	}
	
	this._setIndexBufferData = function(buffer, data) {
		this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, buffer);
		
		this._glContext.bufferData(this._glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this._glContext.STATIC_DRAW);
		buffer.itemSize = 1;
		buffer.numItems = data.length;
	}
	
	this._setArrayBufferData = function(buffer, data, itemSize) {
		this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, buffer);
	    
		this._glContext.bufferData(this._glContext.ARRAY_BUFFER, new Float32Array(data), this._glContext.STATIC_DRAW);
		buffer.itemSize = itemSize;
		buffer.numItems = data.length / itemSize;			
	}
	
	this.drawOnce = function(activeShader) {
		var shaderHandles = this._getShaderHandles(activeShader);
		
		this._setAttributeArrayState(shaderHandles, true);
		
		this._bindGeometry(shaderHandles);
		
		if (!this._indexed) {
			this._glContext.drawArrays(this._primitiveType, 0, this._vertexPositionBuffer.numItems);
		} else {
			this._glContext.drawElements(this._primitiveType, this._indexBuffer.numItems, this._glContext.UNSIGNED_SHORT, 0);
		}
		
		this._setAttributeArrayState(shaderHandles, false);
	}
	
	this._setAttributeArrayState = function(shaderHandles, enabled) {
		for (attribute in shaderHandles) {
			attributeHandle = shaderHandles[attribute];
			
			if (attributeHandle != null) {
				if (enabled)
					this._glContext.enableVertexAttribArray(attributeHandle);
				else
					this._glContext.disableVertexAttribArray(attributeHandle);
			}			
		}
	}	
	
	this._bindGeometry = function(shaderHandles) {
		this._bindFloatBuffer(this._vertexPositionBuffer, shaderHandles.vertexPosition);
		this._bindFloatBuffer(this._colorBuffer, shaderHandles.color);
		this._bindFloatBuffer(this._normalBuffer, shaderHandles.normal);
		
		for (textureLevel in this._textureCoordinateBuffers) {
			var texCoordBuffer = this._textureCoordinateBuffers[textureLevel];
			
			if (texCoordBuffer != undefined && texCoordBuffer != null &&
				shaderHandles.textureCoordinates[textureLevel] != null) {
				this._bindFloatBuffer(texCoordBuffer, shaderHandles.textureCoordinates[textureLevel]);
			}
		}

		this._bindIndexBuffer();
	}
	
	this._bindFloatBuffer = function(buffer, attributeHandle) {
		if (buffer != null && attributeHandle != null) {
			this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, buffer);
			this._glContext.vertexAttribPointer(attributeHandle, buffer.itemSize, this._glContext.FLOAT, false, 0, 0);
		}
	}
	
	this._bindIndexBuffer = function() {
		if (this._indexed && this._indexBuffer != null) {
			this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, this._indexBuffer);			
		}
	}
	
	this._unpack = function(colors, unpackCount) {
		var unpackedColors = [];
		for (var i in colors) {
			var color = colors[i];
	        for (var j=0; j < unpackCount; j++) {
	        	unpackedColors = unpackedColors.concat(color);
	        }
	    }
		
		return unpackedColors;
	}
}