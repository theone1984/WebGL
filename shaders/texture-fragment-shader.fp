#ifdef GL_ES
	precision highp float;
#endif

uniform sampler2D textureSampler;

varying vec2 textureCoordinate;
varying vec3 normal;
varying vec3 lightDirection;

void main(void) {
	vec3 normalizedNormal = normalize(normal);
	vec3 normalizedLightDirection = normalize(lightDirection);
	
	vec3 ambientColor = vec3(0.2, 0.2, 0.2);
	vec3 diffuseColor = vec3(0.5, 0.5, 0.5);
	vec3 specularColor = vec3(1.0, 1.0, 1.0);
	
	//gl_FragColor = ;
	//gl_FragColor = vec4(textureCoordinate.s, textureCoordinate.t, 1.0, 1.0);
	//gl_FragColor = vec4(1.0);
	//gl_FragColor = vec4(normalizedNormal.xyz, 1.0);
	
	float diffuseFactor = max(0.0, (dot(normalizedLightDirection, normalizedNormal)));

	vec3 lightColor = ambientColor + diffuseFactor * diffuseColor;

	vec3 reflectedVector =  normalize(reflect(-normalizedLightDirection, normalizedNormal));
	float specularFactor = max(0.0, dot(reflectedVector, normalizedNormal));

	if (diffuseFactor != 0.0) {
		specularFactor = pow(specularFactor, 128.0);
		lightColor += specularColor * specularFactor;
	}

	vec4 textureColor = texture2D(textureSampler, textureCoordinate);
	
	gl_FragColor = vec4(lightColor.rgb * textureColor.rgb, textureColor.a);	
}