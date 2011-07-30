
function Shader(glContext, shaderName) {
	this._glContext = null;
	this.shaderName = "";
	
	this._shaderProgram = null;
	
	this.createShaderFromHtmlElements = function(vertexShaderId, fragmentShaderId) {
		var vertexShaderSource = this._getTextFromHtmlElement(vertexShaderId);
		var fragmentShaderSource = this._getTextFromHtmlElement(fragmentShaderId);
		
		this.createShader(vertexShaderSource, fragmentShaderSource);
	}
	
	this._getTextFromHtmlElement = function(elementId) {
		var element = document.getElementById(elementId);
		
		if (element == null)
			return "";
		
		var text = "";
		var node = element.firstChild;
	    while (node) {
	    	if (node.nodeType == 3)
	    		text += node.textContent;
	    	node = node.nextSibling;
		}
	    
	    return text;
	}

	this.createShader = function(vertexShaderSource, fragmentShaderSource) {
		var vertexShader = this._getShader(vertexShaderSource, this._glContext.VERTEX_SHADER);
		var fragmentShader = this._getShader(fragmentShaderSource, this._glContext.FRAGMENT_SHADER);
		
		this._shaderProgram = this._glContext.createProgram();
		
		this._glContext.attachShader(this._shaderProgram, vertexShader);
		this._glContext.attachShader(this._shaderProgram, fragmentShader);
		this._glContext.linkProgram(this._shaderProgram);
		
		if (!this._glContext.getProgramParameter(this._shaderProgram, this._glContext.LINK_STATUS)) {
			throw "Could not initialize the shader program";
		}
		
		this.use();
	}
	
	this._getShader = function(shaderSource, shaderType) {
		var shader = null;
		
		if (shaderSource == null)
			return null;
		
		shader = this._glContext.createShader(shaderType);
		this._glContext.shaderSource(shader, shaderSource);
		this._glContext.compileShader(shader);

		if (!this._glContext.getShaderParameter(shader, this._glContext.COMPILE_STATUS))
			throw this._glContext.getShaderInfoLog(shader);

		return shader;
	}
	
	this.getVertexAttributeHandles = function(shaderAttributeNames) {
		var attributeHandles = [];		
		if (shaderAttributeNames == null)
			shaderAttributeNames = [];
		
		for (var i = 0; i < shaderAttributeNames.length; i++)
			attributeHandles[i] = this.getVertexAttributeHandle(shaderAttributeNames[i]);
		
		return attributeHandles;
	}
	
	this.getVertexAttributeHandle = function(shaderAttributeName) {
		if (shaderAttributeName == null)
			return null;
		
		return this._glContext.getAttribLocation(this._shaderProgram, shaderAttributeName);
	}
	
	this.getUniformHandles = function(shaderUniformNames) {
		var uniformHandles = [];		
		if (shaderUniformNames == null)
			shaderUniformNames = [];
		
		for (var i = 0; i < shaderUniformNames.length; i++)
			uniformHandles[i] = this.getUniformHandle(shaderUniformNames[i]);
		
		return uniformHandles;
	}
	
	this.getUniformHandle = function(shaderUniformName) {
		if (shaderUniformName == null)
			return null;
		
		return this._glContext.getUniformLocation(this._shaderProgram, shaderUniformName);
	}
	
	this.use = function() {
		this._glContext.useProgram(this._shaderProgram);
	}
	
	this.setUniformMatrix3 = function(uniformHandle, matrix) {
		this._glContext.uniformMatrix3fv(uniformHandle, false, new Float32Array(matrix));
	}
	
	this.setUniformMatrix4 = function(uniformHandle, matrix) {
		this._glContext.uniformMatrix4fv(uniformHandle, false, new Float32Array(matrix));
	}
	
	this.setUniform1i = function(uniformHandle, value) {
		this._glContext.uniform1i(uniformHandle, value);
	}
	
	this.setUniform1f = function(uniformHandle, value) {
		this._glContext.uniform1f(uniformHandle, value);
	}
	
	this.setUniform3f = function(uniformHandle, vector) {
		this._glContext.uniform3fv(uniformHandle, vector);
	}
	
	this.getShaderProgram = function() {
		return this._shaderProgram;
	}
	
	this.toString = function() {
		return this.shaderName;
	}
	
	// Constructor
	{
		this._glContext = glContext;
		this.shaderName = shaderName;
	}
}