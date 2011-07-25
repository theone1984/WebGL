
function ColoredCubeGeometry(glContext, sideLength, sideColors) {
	CubeGeometry.apply(this, [ glContext, sideLength ]);
	
	// Constructor
	{
		var unpackedColors = this._unpack(sideColors, 4);		
		this.setColorData(unpackedColors);		
	}
}