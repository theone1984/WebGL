

function FpsCounter(newValueInterval, newValueStartInterval) {
	this._newValueTakeoverInterval = 0;
	this._newValueStartInterval = 0;
	
	this._started = false;
	
	this._startDate = null;
	this._frameCount = 0;
	
	this._newIntervalStartDate = null;
	this._newIntervalFrameCount = 0;
	
	this.onNewFpsValue = null;
	
	this.increment = function() {
		if (this._started) {
			this._frameCount++;
			this._newIntervalFrameCount++;
		}
	}
	
	this.getCurrentFrameCount = function() {
		var fps = 0;		
		if (this._startDate != null) {
			var currentTime = (new Date()).getTime();
			var startTime = this._startDate.getTime();
			
			var timePassed = (currentTime - startTime) / 1000.0;
			fps = Math.round(this._frameCount / timePassed);
		}
		
		return fps;
	}
	
	this._startNewInterval = function() {
		this._fireOldIntervalFpsValue();
		
		this._newIntervalFrameCount = 0;
		this._newIntervalStartDate = new Date();
		
		var that = this;
		if (this._started)
			setTimeout(function() { that._takeOverNewInterval(); }, this._newValueTakeoverInterval);
	}
	
	this._fireOldIntervalFpsValue = function() {
		var fps = this.getCurrentFrameCount();		
		this.onNewFpsValue.fire(fps);
	}
	
	this._takeOverNewInterval = function() {
		this._frameCount = this._newIntervalFrameCount;
		this._startDate = this._newIntervalStartDate;
		
		var that = this;		
		if (this._started)
			setTimeout(function() { that._startNewInterval(); }, this._newValueStartInterval);
	}
	
	this.start = function() {
		this._started = true;		
		this._startNewInterval();
	}
	
	this.stop = function() {
		this._started = false;
	}
	
	// Constructor
	{
		this.onNewFpsValue = new CustomEvent();
		
		this._newValueStartInterval = newValueStartInterval;
		this._newValueTakeoverInterval = newValueInterval - newValueStartInterval;
	}
}