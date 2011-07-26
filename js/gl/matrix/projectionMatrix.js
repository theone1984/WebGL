
function ProjectionMatrix() {	
	this._projectionMatrix = mat4.create();
	
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
	
	this.getMatrix = function() {
		return new Float32Array(this._projectionMatrix);
	}
}