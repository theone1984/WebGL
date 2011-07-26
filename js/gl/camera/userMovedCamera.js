
function UserMovedCamera(modelViewMatrix, htmlElementId) {
	this._modelViewMatrix = null;
	
	this._htmlElement = null;
	this.elementWidth = 0;
	this.elementHeight = 0;
	
	this._mouseDown = false;
	this._mouseStartX = -1;
	this._mouseStartY = -1;
	
	this._lastDeltaX = 0.0;
	this._lastDeltaY = 0.0;
	
	this._keysPressed = {};
	this._keyTimer = null;
	
	this.bindMouseMovement = function() {
		var that = this;
		
		this._htmlElement.onmousedown = function(e) { that._handleMouseDown(e); };
		document.onmouseup = function(e) { that._handleMouseUp(e); };
		this._htmlElement.onmousemove = function(e) { that._handleMouseMove(e) };
		
		document.onkeydown = function(e) { that._handleKeyDown(e); };
		document.onkeyup = function(e) { that._handleKeyUp(e); };
	}
	
	this._handleMouseDown = function(e) {
		if (e.button == 0 && !this._mouseDown)
			this._startCameraMovement(e.clientX, e.clientY);
	}
	
	this._handleMouseUp = function(e) {
		if (e.button == 0)
			this._stopCameraMovement(e.clientX, e.clientY);
	}
	
	this._handleMouseMove = function(e) {
		if (this._mouseDown)
			this._moveCamera(e.clientX, e.clientY);
	}
	
	this._handleKeyDown = function(e) {
		// Save time instead of bool
		this._keysPressed[e.keyCode] = true;
	}
	
	this._handleKeyUp = function(e) {
		// Save time instead of bool
		this._keysPressed[e.keyCode] = false;
	}
	
	this._handleTimer = function() {
		// Update position according to time
	}
	
	this._startCameraMovement = function(positionX, positionY) {
		this._mouseDown = true;
		this._mouseStartX = positionX;
		this._mouseStartY = positionY;
	}
	
	this._stopCameraMovement = function(positionX, positionY) {
		this._mouseDown = false;
		
		this._lastDeltaX = this._lastDeltaX + (positionX - this._mouseStartX) / this._elementWidth;
		this._lastDeltaY = this._lastDeltaY + (positionY - this._mouseStartY) / this._elementHeight;
		
		this._mouseStartX = -1;
		this._mouseStartY = -1;
	}
	
	this._moveCamera = function(positionX, positionY) {
		var deltaX = (positionX - this._mouseStartX) / this._elementWidth;
		var deltaY = (positionY - this._mouseStartY) / this._elementHeight;
		
		this._modelViewMatrix.lookAt(0.0, 0.0, 0.0, -Math.sin(this._lastDeltaX + deltaX), Math.sin(this._lastDeltaY + deltaY), -Math.cos(this._lastDeltaX + deltaX), 0.0, 1.0, 0.0);
	}
	
	// Constructor
	{
		var that = this;
		
		this._htmlElement = document.getElementById(htmlElementId);
		this._elementWidth = this._htmlElement.width;
		this._elementHeight = this._htmlElement.height;
		
		this._modelViewMatrix = modelViewMatrix;
		this._keyTimer = new Timer(50, function() {
			that._handleTimer();
		})
	}
	
}