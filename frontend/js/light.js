
var Light = {
    WHITE: 0xFFFFFF,
    FULL_STRENGTH: 1
};

Light.createDirectionalLight = function(color, strength, pos ) {
    var directionalLight = new THREE.DirectionalLight( color, strength );
    Utils.setXYZ(directionalLight.position, pos);
    return directionalLight;
}

Light.createHemisphereLight = function( colorSky, colorGround, strength) {
    var hemiLight = new THREE.HemisphereLight( colorSky, colorGround, strength);
    return hemiLight;
};

Light.createPointLight = function( color, strength, distance, position) {
    var pointLight = new THREE.PointLight( color, strength, distance);
    Utils.setXYZ(pointLight.position, position);
    return pointLight;
};

Light.generateLight = function(light) {

	if (light.type === "DirectionalLight") {
		return Light.createDirectionalLight(Light.WHITE, light.strength, new THREE.Vector3( light.position.x, light.position.y, light.position.z));
	} else if (light.type === "HemisphereLight") {
		return Light.createHemisphereLight(Utils.stringHexToHex( light.sky ), Utils.stringHexToHex( light.ground ), light.strength);
	} else if (light.type === "PointLight") {
		return Light.createPointLight(Utils.stringHexToHex( light.color ), light.strength, light.distance, light.position);
	}
};

Light.generateLights = function(blueprintOfObject, x, z) {

    var lights = [];

    if (blueprintOfObject !== undefined) {
        for (var i = 0; i < blueprintOfObject.lights.length; i++) {
            var lightBlueprint = blueprintOfObject.lights[i];

            var light = Light.generateLight(lightBlueprint);
            light.position.set(x, light.position.y, z);

            lights.push(light);
        }
    }

    return lights;
}
