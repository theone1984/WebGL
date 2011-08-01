#ifdef GL_ES
	precision highp float;
#endif

uniform sampler2D textureSampler;
uniform sampler2D normalSampler;

uniform vec3 lightColor;
uniform float ambientFactor;
uniform float diffuseFactor;
uniform float specularFactor;

varying vec2 textureCoordinate;
varying vec3 normal_Object;
varying vec3 tangent_Object;
varying vec3 binormal_Object;
varying vec3 lightDirection_Object;

void main(void) {
	vec4 normalTextureColor = texture2D(normalSampler, textureCoordinate);
	vec3 normal_Tangent = normalize(normalTextureColor.rgb * 2.0 - vec3(1.0, 1.0, 1.0));
	
	vec4 textureColor = texture2D(textureSampler, textureCoordinate);
	
	vec3 resultingNormal_Object = binormal_Object * normal_Tangent.x + 
								  tangent_Object * normal_Tangent.y +
								  normal_Object * normal_Tangent.z;

	float diffuseIntensity = max(0.0, (dot(lightDirection_Object, resultingNormal_Object)));
	vec3 resultingLightColor = ambientFactor * lightColor + diffuseIntensity * diffuseFactor * lightColor;
	
	vec3 resultingColor = resultingLightColor * textureColor.rgb;
	
	vec3 reflectedVector_Object =  normalize(reflect(-lightDirection_Object, resultingNormal_Object));
	float specularIntensity = max(0.0, dot(reflectedVector_Object, resultingNormal_Object));
	
	if (diffuseIntensity != 0.0) {
		specularIntensity = pow(specularIntensity, 100.0);
		resultingColor += specularIntensity * specularFactor * lightColor;
	}
	
	gl_FragColor = vec4(resultingColor.rgb, textureColor.a);
}