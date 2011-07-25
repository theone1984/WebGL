
function Shader(glContext) {
	this._glContext = glContext;
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
	
	this.bindVertexAttribute = function(shaderAttributeName, attributeHandle) {
		this._shaderProgram[attributeHandle] = this._glContext.getAttribLocation(this._shaderProgram, shaderAttributeName);
		this._glContext.enableVertexAttribArray(this._shaderProgram[attributeHandle]);
	}
	
	this.use = function() {
		this._glContext.useProgram(this._shaderProgram);
	}
	
	this.bindUniformAttribute = function(uniformAttributeName, attributeHandle) {
		this._shaderProgram[attributeHandle] = this._glContext.getUniformLocation(this._shaderProgram, uniformAttributeName);
	}
	
	this.setUniformMatrix4 = function(attributeHandle, matrix) {
		this._glContext.uniformMatrix4fv(this._shaderProgram[attributeHandle], false, new Float32Array(matrix));
	}
	
	this.setUniform1i = function(attributeHandle, value) {
		this._glContext.uniform1i(this._shaderProgram[attributeHandle], value);
	}
	
	this.getShaderProgram = function() {
		return this._shaderProgram;
	}
}