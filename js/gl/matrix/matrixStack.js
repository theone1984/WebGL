
function MatrixStack() {
	this.modelViewMatrix = null;
	this.projectionMatrix = null;

	// Constructor
	{
		this.modelViewMatrix = new ModelViewMatrix();
		this.projectionMatrix = new ProjectionMatrix();		
	}
}