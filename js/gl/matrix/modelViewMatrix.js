
function ModelViewMatrix() {
	this._modelMatrixStack = [];
	this._modelNormalMatrixStack = [];
	
	this._modelNormalMatrix = mat4.create();
	
	this._modelMatrix = mat4.create();
	this._viewMatrix = mat4.create();
	
	this.lookAt = function(ex, ey, ez, cx, cy, cz, ux, uy, uz) {
		var eye = vec3.create([ex, ey, ez]);
		var center = vec3.create([cx, cy, cz]);
		var up = vec3.create([ux, uy, uz]);
		
		var forward = vec3.create();
		vec3.subtract(center, eye, forward);
		vec3.normalize(forward);
		
		var side = vec3.create();
		vec3.cross(forward, up, side);
		vec3.normalize(side);
		
		vec3.cross(side, forward, up);
		vec3.normalize(up);
		
		var m = mat4.create([side[0], up[0], -forward[0], 0, side[1], up[1], -forward[1], 0, side[2], up[2], -forward[2], 0, 0, 0, 0, 1]);
		var t = mat4.create([1, 0, 0, -ex, 0, 1, 0, -ey, 0, 0, 1, -ez, 0, 0, 0, 1]);
		
		mat4.multiply(m, t, this._viewMatrix);
	}
	
	this.pushMatrix = function() {
		var copiedModelMatrix = this._copyMatrix(this._modelMatrix);
		this._modelMatrixStack.push(copiedModelMatrix);
		
		var copiedModelNormalMatrix = this._copyMatrix(this._modelNormalMatrix);
		this._modelNormalMatrixStack.push(copiedModelNormalMatrix);
	}
	
	this._copyMatrix = function(matrixToCopy) {
		var copiedMatrix = mat4.create();
		mat4.set(matrixToCopy, copiedMatrix);		
		return copiedMatrix;
	}
	
	this.popMatrix = function() {
		if (this._modelMatrixStack.length == 0 || this._modelNormalMatrixStack.length == 0) {
			throw "Matrix stack was exceeded.";
		}
		
		this._modelMatrix = this._modelMatrixStack.pop();
		this._modelNormalMatrix = this._modelNormalMatrixStack.pop();
	}
	
	this.rotate = function(degrees, xAxis, yAxis, zAxis) {
		var radians = this._degreesToRadian(degrees);
		
		mat4.rotate(this._modelMatrix, radians, [xAxis, yAxis, zAxis]);
		mat4.rotate(this._modelNormalMatrix, radians, [xAxis, yAxis, zAxis]);
	}
	
	this.translate = function(xAxis, yAxis, zAxis) {
		mat4.translate(this._modelMatrix, [xAxis, yAxis, zAxis]);
	}
	
	this.scale = function(xAxis, yAxis, zAxis) {
		mat4.scale(this._modelMatrix, [xAxis, yAxis, zAxis]);
	}
	
	this._degreesToRadian = function(degrees) {
		return degrees / 180.0 * Math.PI;
	}
	
	this.getMatrix = function() {
		var modelViewMatrix = mat4.create();
		mat4.multiply(this._viewMatrix, this._modelMatrix, modelViewMatrix);
		
		return modelViewMatrix;
	}
	
	this.getNormalMatrix = function() {
		return this._modelNormalMatrix;
	}
	
	// Constructor
	{
		mat4.identity(this._modelMatrix);
		mat4.identity(this._viewMatrix);
		
		mat4.identity(this._modelNormalMatrix);
		
		this.lookAt(0.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0);
	}	
}