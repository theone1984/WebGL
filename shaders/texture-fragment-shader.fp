#ifdef GL_ES
	precision highp float;
#endif

uniform sampler2D textureSampler;

uniform vec3 lightColor;
uniform float ambientFactor;
uniform float diffuseFactor;
uniform float specularFactor;

varying vec2 textureCoordinate;
varying vec3 normal;
varying vec3 lightDirection;

void main(void) {
	vec3 normalizedNormal = normalize(normal);
	vec3 normalizedLightDirection = normalize(lightDirection);
	
	float diffuseIntensity = max(0.0, (dot(normalizedLightDirection, normalizedNormal)));
	vec3 resultingLightColor = ambientFactor * lightColor + diffuseIntensity * diffuseFactor * lightColor;
	
	vec4 textureColor = texture2D(textureSampler, textureCoordinate);
	
	vec3 resultingColor = resultingLightColor * textureColor.rgb;

	vec3 reflectedVector =  normalize(reflect(-normalizedLightDirection, normalizedNormal));
	float specularIntensity = max(0.0, dot(reflectedVector, normalizedNormal));

	if (diffuseIntensity != 0.0) {
		specularIntensity = pow(specularIntensity, 100.0);
		resultingColor += specularIntensity * specularFactor * lightColor;
	}

	gl_FragColor = vec4(resultingColor.rgb, textureColor.a);
}