#ifdef GL_ES
	precision highp float;
#endif

varying vec4 outputColor;

void main(void) {
	gl_FragColor = outputColor;
}