
function SphereGeometry(glContext, diameter, latitudeBands, longitudeBands) {
	ArrayBasedGeometry.apply(this, [ glContext, glContext.TRIANGLE_STRIP ]);
	
	this._latitudeBands = 0;
	this._longitudeBands = 0;
	this._diameter = 0.0;
	
	this._vertexPositions = []
	this._normals = [];
	this._tangents = [];
	this._textureCoordinates = [];
	
	this._indexData = [];
	
	this._createVertexArrays = function() {
		for (var latitudeIndex = 0; latitudeIndex <= this._latitudeBands; latitudeIndex++) {
			for (var longitudeIndex = 0; longitudeIndex <= this._longitudeBands; longitudeIndex++) {
				
				this._vertexPositions = this._vertexPositions.concat(this._getPosition(latitudeIndex, longitudeIndex));
				
				this._normals = this._normals.concat(this._getNormal(latitudeIndex, longitudeIndex));
				this._tangents = this._tangents.concat(this._getTangent(latitudeIndex, longitudeIndex));				
				this._textureCoordinates = this._textureCoordinates.concat(this._getTextureCoordinates(latitudeIndex, longitudeIndex));
			}
		}
	}
	
	this._getPosition = function(latitudeIndex, longitudeIndex) {
		var position = this._getNormal(latitudeIndex, longitudeIndex);
		
		for (var i = 0; i < position.length; i++) {
			position[i] *= this._diameter / 2;
		}
		
		return position;
	}
	
	this._getNormal = function(latitudeIndex, longitudeIndex) {
		var theta = latitudeIndex * Math.PI / this._latitudeBands;
		var phi = longitudeIndex * 2 * Math.PI / this._longitudeBands;
		
		var sinValueTheta = Math.sin(theta); var cosValueTheta = Math.cos(theta);
		var sinValuePhi = Math.sin(phi); var cosValuePhi = Math.cos(phi)
		
		return [cosValuePhi * sinValueTheta, cosValueTheta, sinValuePhi * sinValueTheta];
	}
	
	this._getTangent = function(latitudeIndex, longitudeIndex) {
		var normal1 = vec3.create(this._getNormal(latitudeIndex, longitudeIndex));
		var normal2 = vec3.create(this._getNormal(latitudeIndex, longitudeIndex - 5));
		
		var tangent = vec3.create();
		vec3.cross(normal1, normal2, tangent);
		vec3.normalize(tangent, tangent);
		
		return [ tangent[0], tangent[1], tangent[2] ];
	}
	
	this._getTextureCoordinates = function(latitudeIndex, longitudeIndex) {
		var u = 1 - (longitudeIndex / this._longitudeBands);
		var v = latitudeIndex / this._latitudeBands;
		
		return [u, v];
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
		this.setTangentData(this._tangents);
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