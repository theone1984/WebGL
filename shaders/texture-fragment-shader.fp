#ifdef GL_ES
	precision highp float;
#endif

uniform sampler2D textureSampler;

varying vec2 textureCoordinate;

void main(void) {
	gl_FragColor = texture2D(textureSampler, textureCoordinate);
	//gl_FragColor = vec4(textureCoordinate.s, textureCoordinate.t, 1.0, 1.0);
	//gl_FragColor = vec4(1.0);
}