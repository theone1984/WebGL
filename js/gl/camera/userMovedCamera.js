
function UserMovedCamera(modelViewMatrix, htmlElementId) {
	this._FORWARD_KEY	= 87; // W
	this._BACKWARD_KEY	= 83; // S 
	this._LEFT_KEY		= 65; // A
	this._RIGHT_KEY		= 68; // D 
	
	this._keyboardSensitivity = 1.0;
	this._mouseSensitivity = 1.0;
	
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
	
	this._currentPosition = vec3.create();
	this._currentLookAtVector = vec3.create([0, 0, -1]);

	this._upVector = vec3.create([0, 1, 0]);
	
	this._setHtmlProperties = function(htmlElementId) {
		this._htmlElement = document.getElementById(htmlElementId);
		this._elementWidth = this._htmlElement.width;
		this._elementHeight = this._htmlElement.height;
	}
	
	this._startTimer = function() {
		var that = this;
		this._keyTimer = new Timer(function() {
			that._handleTimer();
		}, 50);
		this._keyTimer.start();
	}
	
	this.bindUserInput = function() {
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
		this._keysPressed[e.keyCode] = true
	}
	
	this._handleKeyUp = function(e) {
		// Save time instead of bool
		this._keysPressed[e.keyCode] = false;
	}
	
	this._handleTimer = function() {
		this._handleKeyInput();
		this._updateLookAt();
	}
	
	this._handleKeyInput = function() {
		var normalizedLookAtVector = vec3.create();
		var normalizedSideVector = vec3.create();
		
		vec3.normalize(this._currentLookAtVector, normalizedLookAtVector);
		
		vec3.cross(this._upVector, normalizedLookAtVector, normalizedSideVector);
		vec3.normalize(normalizedSideVector);
				
		var moveForwardVector = vec3.create();
		var moveToSideVector = vec3.create();
		
		if (this._keysPressed[this._FORWARD_KEY]) {
			vec3.scale(normalizedLookAtVector, this._determineMovementFactor(this._FORWARD_KEY), moveForwardVector);
		} else if (this._keysPressed[this._BACKWARD_KEY]) {
			vec3.scale(normalizedLookAtVector, -this._determineMovementFactor(this._BACKWARD_KEY), moveForwardVector);
		} else if (this._keysPressed[this._LEFT_KEY]) {
			vec3.scale(normalizedSideVector, this._determineMovementFactor(this._LEFT_KEY), moveToSideVector);
		} else if (this._keysPressed[this._RIGHT_KEY]) {
			vec3.scale(normalizedSideVector, -this._determineMovementFactor(this._RIGHT_KEY), moveToSideVector);
		}
		
		vec3.add(this._currentPosition, moveForwardVector);
		vec3.add(this._currentPosition, moveToSideVector);
	}
	
	this._determineMovementFactor = function(keyNumber) {
		return this._keyboardSensitivity * 0.2;
	}
	
	this._updateLookAt = function() {
		this._modelViewMatrix.lookAt(this._currentPosition[0],
									 this._currentPosition[1],
									 this._currentPosition[2],
									 this._currentPosition[0] + this._currentLookAtVector[0],
									 this._currentPosition[1] + this._currentLookAtVector[1],
									 this._currentPosition[2] + this._currentLookAtVector[2],
									 this._upVector[0],
									 this._upVector[1],
									 this._upVector[2]);
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
		
		this._currentLookAtVector = vec3.create([this._mouseSensitivity * -Math.sin(this._lastDeltaX + deltaX),
		                                         this._mouseSensitivity *  Math.sin(this._lastDeltaY + deltaY),
		                                         this._mouseSensitivity * -Math.cos(this._lastDeltaX + deltaX)]);
	
		this._updateLookAt();
	}
	
	// Constructor
	{
		this._modelViewMatrix = modelViewMatrix;
		
		this._setHtmlProperties(htmlElementId);
		this._startTimer();
	}	
}