
function ArrayBasedGeometry(glContext, primitiveType) {
	this._glContext = glContext;
	this._primitiveType = primitiveType;
	
	this._vertexPositionBuffer = null;	
	this._colorBuffer = null;
	this._indexBuffer = null;
	
	this._indexed = false;
	
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
	
	this.setVertexPositionData = function(vertexData) {
		if (this._vertexPositionBuffer == null)
			this._vertexPositionBuffer = this._glContext.createBuffer();
		
		this._setArrayBufferData(this._vertexPositionBuffer, vertexData, 3);
	}
	
	this.setColorData = function(colorData) {
		if (this._colorBuffer == null)
			this._colorBuffer = this._glContext.createBuffer();
		
		this._setArrayBufferData(this._colorBuffer, colorData, 4);
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
	
	this._bindGeometry = function(shaderProgram, vertexPositionAttribute, colorAttribute) {
		if (this._vertexPositionBuffer != null) {
			this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._vertexPositionBuffer);
			this._glContext.vertexAttribPointer(shaderProgram[vertexPositionAttribute], this._vertexPositionBuffer.itemSize, this._glContext.FLOAT, false, 0, 0);
		}		
		
		if (this._colorBuffer != null) {
			this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._colorBuffer);
			this._glContext.vertexAttribPointer(shaderProgram[colorAttribute], this._colorBuffer.itemSize, this._glContext.FLOAT, false, 0, 0);
		} else {
			
		}
		
		if (this._indexBuffer != null) {
			this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, this._indexBuffer);			
		}
	}
	
	this.drawOnce = function(shaderProgram, vertexPositionAttribute, colorAttribute) {
		this._glContext.useProgram(shaderProgram);
		
		this._bindGeometry(shaderProgram, vertexPositionAttribute, colorAttribute);
		

		if (!this._indexed) {
			this._glContext.drawArrays(this._primitiveType, 0, this._vertexPositionBuffer.numItems);
		} else {
			this._glContext.drawElements(this._primitiveType, this._indexBuffer.numItems, this._glContext.UNSIGNED_SHORT, 0);
		}
	}
}