
function MatrixStack() {
	this._modelViewMatrix = mat4.create();
	this._normalMatrix = mat4.create();
	this._projectionMatrix = mat4.create();
	
	this._modelViewMatrixStack = [];
	this._normalMatrixStack = [];
	
	// Constructor
	{
		mat4.identity(this._modelViewMatrix);
		mat4.identity(this._normalMatrix);
		mat4.identity(this._projectionMatrix);
	}
	
	this.pushMatrix = function() {
		var copiedModelViewMatrix = this._copyMatrix(this._modelViewMatrix);
		this._modelViewMatrixStack.push(copiedModelViewMatrix);
		
		var copiedNormalMatrix = this._copyMatrix(this._normalMatrix);
		this._normalMatrixStack.push(copiedNormalMatrix);
	}
	
	this._copyMatrix = function(matrixToCopy) {
		var copiedMatrix = mat4.create();
		mat4.set(matrixToCopy, copiedMatrix);		
		return copiedMatrix;
	}
	
	this.popMatrix = function() {
		if (this._modelViewMatrixStack.length == 0 || this._normalMatrixStack.length == 0) {
			throw "Matrix stack was exceeded.";
		}
		
		this._modelViewMatrix = this._modelViewMatrixStack.pop();
		this._normalMatrix = this._normalMatrixStack.pop();
	}
	
	this.rotate = function(degrees, xAxis, yAxis, zAxis) {
		var radians = this._degreesToRadian(degrees);
		
		mat4.rotate(this._modelViewMatrix, radians, [xAxis, yAxis, zAxis]);
		mat4.rotate(this._normalMatrix, radians, [xAxis, yAxis, zAxis]);
	}
	
	this.translate = function(xAxis, yAxis, zAxis) {
		mat4.translate(this._modelViewMatrix, [xAxis, yAxis, zAxis]);
	}
	
	this.scale = function(xAxis, yAxis, zAxis) {
		mat4.scale(this._modelViewMatrix, [xAxis, yAxis, zAxis]);
	}
	
	this._degreesToRadian = function(degrees) {
		return degrees / 180.0 * Math.PI;
	}
	
	this.setPerspectiveProjection = function(fieldOfView, aspect, nearPlane, farPlane) {
		var yMax = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
	    var yMin = -yMax;
	    var xMin = yMin * aspect;
	    var xMax = yMax * aspect;
		
		this._projectionMatrix = this._createFrustum(xMin, xMax, yMin, yMax, nearPlane, farPlane);
	}
	
	this._createFrustum = function(left, right, bottom, top, near, far) {
		var x = 2 * near / (right - left);
		var y = 2 * near / (top - bottom);
		var a = (right + left) / (right - left);
		var b = (top + bottom) / (top - bottom);
		var c = -(far + near) / (far-near);
		var d = -2 * far * near / (far - near);
		
		return [x, 0, 0, 0, 0, y, 0, 0, a, b, c, -1, 0, 0, d, 0];
	}

	this.setOrthogoalProjection = function(left, right, bottom, top, near, far) {
	    var x = - (right + left) / (right - left);
	    var y = - (top + bottom) / (top - bottom);
	    var z = - (far + near) / (far - near);

	    return [2 / (right - left), 0, 0, 0, 0, 2 / (top - bottom), 0, 0, 0, 0,  -2 / (far - near), x, y, z, 1];
	}	
	
	this.getModelViewMatrix = function() {
		return this._modelViewMatrix;		
	}
	
	this.getNormalMatrix = function() {
		return this._normalMatrix;
	}
	
	this.getProjectionMatrix = function() {
		return new Float32Array(this._projectionMatrix);
	}
}