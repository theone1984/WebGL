
function PyramidGeometry(glContext, sideLength, sideColors) {
	ArrayBasedGeometry.apply(this, [ glContext, glContext.TRIANGLES ]);
	
	var nValue = -sideLength / 2.0;
	var zValue = 0.0;
	var pValue = sideLength / 2.0;
	
    var vertexPositions = [
	    // Front face
		zValue, pValue, zValue,
		nValue, nValue, pValue,
		pValue, nValue, pValue,
		 
		// Right face
		zValue, pValue,  zValue,
		pValue, nValue, pValue,
		pValue, nValue, nValue,
		 
		// Back face
		zValue, pValue, zValue,
		pValue, nValue, nValue,
		nValue, nValue, nValue,
		 
		// Left face
		zValue, pValue, zValue,
		nValue, nValue, nValue,
		nValue, nValue, pValue
    ];
    
    var colors = [

    ];
    
	// Constructor
	{
		var unpackedColors = this._unpack(sideColors, 3);
		
		this.setVertexPositionData(vertexPositions);
		this.setColorData(unpackedColors);		
	}
}