
function GraphicalFpsCounter(canvasElementId, border, maxFpsCount) {
	FpsCounter.apply(this, [ 1000, 200 ]);
	
	this._maxFpsCount = 0;
	
	this._context = null;
	this._width = 0;
	this._height = 0;
	this._border = 0;
	
	this._lines = [];
	this._maxLineCount = 0;
	
	this._drawTimer = null;
	
	this._addNewFpsLine = function(fps) {
		this._lines.push(fps);
		if (this._lines.length > this._maxLineCount)
			this._lines.shift();
	}
	
	this._redraw = function() {

		this._clear();
		this._drawFpsLines();
		this._printFpsCount();
	}
	
	this._clear = function() {
		var context = this._context;
		
		context.fillStyle = '#000000';
		context.fillRect(0, 0, this._width, this._height);
	}
	
	this._drawFpsLines = function() {
		var context = this._context;		

		
		for (var i = 0; i < this._lines.length; i++) {
			this._drawFpsLine(i, this._lines[i]);
		}
	}
	
	this._drawFpsLine = function(index, fps) {
		var context = this._context;
		
		var x = this._width - this._border - this._lines.length + index;
		var y1 = this._height - this._border;
		var y2 = this._height - this._border - (fps / this._maxFpsCount) * (this._height - 2 * this._border - 20);
		
		if (fps < this._maxFpsCount / 3)
			context.strokeStyle = '#FF0000';
		else if (fps < this._maxFpsCount / 2)
			context.strokeStyle = '#FFFF00';
		else
			context.strokeStyle = '#00FF00';
		
		context.beginPath();
		context.moveTo(x, y1);
		context.lineTo(x, y2);
		context.stroke();		
	}
	
	this._initCanvas = function(canvasElementId, border) {
		var canvas = document.getElementById(canvasElementId);
		this._context = canvas.getContext('2d');
		
		this._width = canvas.width;
		this._height = canvas.height;
		this._border = border;
		
		console.log(this._width);
		
		this._maxLineCount = canvas.width - 2 * border;
	}
	
	this._printFpsCount = function() {
		var context = this._context;
		
		var fpsText = this.getCurrentFrameCount() + " FPS";

		context.font = "12px Arial";
		context.fillStyle = '#00FF00';
		context.fillText(fpsText, this._border, 10 + this._border);
	}
	
	this._initVariables = function(maxFpsCount) {
		this._maxFpsCount = maxFpsCount;

		var that = this;
		this.onNewFpsValue.subscribe(function(fps) { that._addNewFpsLine(fps); });
		this._drawTimer = new Timer(function() { that._redraw(); }, 100);
		
		this._drawTimer.start();
	}
	
	
	// Constructor
	{
		this._initCanvas(canvasElementId, border);
		this._initVariables(maxFpsCount);
	}	
}