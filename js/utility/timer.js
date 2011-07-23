
function Timer(callbackFunction, timeout) {
	this.callbackFunction = callbackFunction;
	this.timeout = timeout;
	
	this.timerHandle = null;	
	this.startTime = 0;
	
	this.start = function() {
		if (this.timerHandle == null) {
			this.timerHandle = setInterval(this.callbackFunction, this.timeout);
			this.startTime = (new Date()).getTime();
		}
	}
	
	this.stop = function() {
		if (this.timerHandle != null) {
			clearInterval(this.timerHandle);
			this.startTime = null;
		}
	}
	
	this.getElapsedTime = function() {
		if (this.timerHandle != null) {
			return (new Date()).getTime() - this.startTime;
		}		
		return 0;
	}	
}