
function SphereGeometry(glContext, diameter, latitudeBands, longitudeBands) {
	ArrayBasedGeometry.apply(this, [ glContext, glContext.TRIANGLE_STRIP ]);
	
	this._latitudeBands = 0;
	this._longitudeBands = 0;
	this._diameter = 0.0;
	
	this._vertexPositions = []
	this._normals = [];
	this._textureCoordinates = [];
	
	this._indexData = [];
	
	this._createVertexArrays = function() {
		for (var latitudeIndex = 0; latitudeIndex <= this._latitudeBands; latitudeIndex++) {
			var theta = latitudeIndex * Math.PI / this._latitudeBands;
			var sinValueTheta = Math.sin(theta);
			var cosValueTheta = Math.cos(theta);
	 
			for (var longitudeIndex = 0; longitudeIndex <= this._longitudeBands; longitudeIndex++) {
				var phi = longitudeIndex * 2 * Math.PI / this._longitudeBands;
				var sinValuePhi = Math.sin(phi);
				var cosValuePhi = Math.cos(phi);
	 
				var x = cosValuePhi * sinValueTheta;
				var y = cosValueTheta;
				var z = sinValuePhi * sinValueTheta;
			  
				var u = 1 - (longitudeIndex / this._longitudeBands);
				var v = latitudeIndex / this._latitudeBands;
	 
				this._normals.push(x);
				this._normals.push(y);
				this._normals.push(z);
			  
				this._textureCoordinates.push(u);
				this._textureCoordinates.push(v);
			  
				this._vertexPositions.push(this._diameter / 2 * x);
				this._vertexPositions.push(this._diameter / 2 * y);
				this._vertexPositions.push(this._diameter / 2 * z);
			}
		}
	}
	  
	this._createIndexArray = function() {
		var index1, index2, index3, index4;
		
		for (var latitudeIndex = 0; latitudeIndex < this._latitudeBands; latitudeIndex++) {
			for (var longitudeIndex = 0; longitudeIndex < this._longitudeBands; longitudeIndex++) {
				index1 = (latitudeIndex * (this._longitudeBands + 1)) + longitudeIndex;
				index2 = index1 + this._longitudeBands + 1;
				index3 = index1 + 1;
				index4 = index2 + 1;
	  
				this._indexData.push(index1);
				this._indexData.push(index2);
				this._indexData.push(index3);
				this._indexData.push(index4);
			}
			
			this._indexData.push(index4);
			this._indexData.push(index4);
		}
	}
	
	this._createBuffersFromArrays = function() {
		this.setVertexPositionData(this._vertexPositions);
		this.setNormalData(this._normals);
		this.set2DTextureCoordinateData(0, this._textureCoordinates);
		
		this.setIndexData(this._indexData);
	}

	// Constructor
	{
		this._latitudeBands = latitudeBands;
		this._longitudeBands = longitudeBands;
		this._diameter = diameter;
		
		this._createVertexArrays();
		this._createIndexArray();
		
		this._createBuffersFromArrays();
	}
}