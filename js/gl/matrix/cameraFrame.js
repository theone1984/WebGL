
function CameraFrame() {
	this._cameraMatrix = mat4.create();
	
	// Constructor
	{
		mat4.identity(this._cameraMatrix);
	}
	
	
	this.getCameraMatrix = funnction() {
		return this._cameraMatrix;
	}	
}