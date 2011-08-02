
function CustomEvent() {
	this._callbackFunctions = [];

	this.subscribe = function(callbackFunction) {
		this._callbackFunctions.push(callbackFunction);
	}
	
	this.unsubscribe = function(callbackFunction) {
		for (var i = this._callbackFunctions.length - 1; i >= 0; i--) {
			if (this._callbackFunctions[i] == callbackFunction) {
				this._callbackFunctions.splice(i, 1);
			}
		}
	}

	this.fire = function(eventArgs) {
		for (var i = 0; i < this._callbackFunctions.length; i++) {
			this._callbackFunctions[i].call(this, eventArgs);		
		}
	};
};