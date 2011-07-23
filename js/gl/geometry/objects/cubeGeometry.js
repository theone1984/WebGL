
function CubeGeometry(glContext, sideLength, sideColors) {
	ArrayBasedGeometry.apply(this, [ glContext, glContext.TRIANGLES ]);
	
	var nValue = -sideLength / 2.0;
	var pValue = sideLength / 2.0;
	
	var vertexPositions = [
       // Front face
       nValue, nValue, pValue,
       pValue, nValue, pValue,
       pValue, pValue, pValue,
       nValue, pValue, pValue,

       // Back face
       nValue, nValue, nValue,
       nValue, pValue, nValue,
       pValue, pValue, nValue,
       pValue, nValue, nValue,

       // Top face
       nValue, pValue, nValue,
       nValue, pValue, pValue,
       pValue, pValue, pValue,
       pValue, pValue, nValue,

       // Bottom face
       nValue, nValue, nValue,
       pValue, nValue, nValue,
       pValue, nValue, pValue,
       nValue, nValue, pValue,

       // Right face
       pValue, nValue, nValue,
       pValue, pValue, nValue,
       pValue, pValue, pValue,
       pValue, nValue, pValue,

       // Left face
       nValue, nValue, nValue,
       nValue, nValue, pValue,
       nValue, pValue, pValue,
       nValue, pValue, nValue
    ]
	
	var indexData = [
		// Front face
		0, 1, 2,
		0, 2, 3,
		 
		// Back face
		4, 5, 6,
		4, 6, 7,
		 
		// Top face
		8, 9, 10,
		8, 10, 11,
		 
		// Bottom face
		12, 13, 14,
		12, 14, 15,
		 
		// Right face
		16, 17, 18,
		16, 18, 19,
		 
		// Left face
		20, 21, 22,
		20, 22, 23
	]
	
	// Constructor
	{
		var unpackedColors = this._unpack(sideColors, 4);
		
		this.setVertexPositionData(vertexPositions);
		this.setColorData(unpackedColors);		
		this.setIndexData(indexData);
	}
}
