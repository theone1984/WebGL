
function ShaderHandler() {
	this._shaderHandleMap = {};
	
	this._addShaderHandles = function(shader, shaderHandles) {
		this._shaderHandleMap[shader.shaderName] = shaderHandles;
	}
	
	this._getShaderHandles = function(shader) {
		if (this._shaderHandleMap[shader.shaderName] == "undefined") {
			throw new Error ("The shader '" + shader.shaderName + "' has not been bound to the object.");
		}
		
		return this._shaderHandleMap[shader.shaderName];
	}	
}
