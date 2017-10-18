
var Entity = {

};

Entity.createCube = function( myColor, scale, pos, rotation) {

    pos = pos || new THREE.Vector3( 0, 0, 0 );
    rotation = rotation || new THREE.Vector3( 0, 1, 0 );

    var geometry = new THREE.BoxGeometry( scale.x, scale.y, scale.z );
    var material = new THREE.MeshLambertMaterial( { color: myColor } );
    var cube = new THREE.Mesh( geometry, material );
    Utils.setXYZ(cube.position, pos);
    Utils.setXYZ(cube.rotation, rotation);

    return cube;
};

Entity.areHitboxesTouching = function(hitbox1, hitbox2) {

    if (
        hitbox1.hitbox !== undefined &&
        hitbox2.hitbox !== undefined &&
        Math.abs(hitbox1.position.x - hitbox2.position.x) < (hitbox1.hitbox.x/2 + hitbox2.hitbox.x/2) &&
        Math.abs(hitbox1.position.y - hitbox2.position.y) < (hitbox1.hitbox.y/2 + hitbox2.hitbox.y/2) &&
        Math.abs(hitbox1.position.z - hitbox2.position.z) < (hitbox1.hitbox.z/2 + hitbox2.hitbox.z/2)
    ) {
        return true;
    }

    return false;
};

Entity.areCoordinatesInCube = function(position, cube, hitbox) {
    var xLess = cube.position.x - hitbox.x/2;
    var xMore = cube.position.x + hitbox.x/2;
    var yLess = cube.position.y - hitbox.y/2;
    var yMore = cube.position.y + hitbox.y/2;
    var zLess = cube.position.z - hitbox.z/2;
    var zMore = cube.position.z + hitbox.z/2;

    if (
        xLess <= position.x && xMore >= position.x &&
        yLess <= position.y && yMore >= position.y &&
        zLess <= position.z && zMore >= position.z
    ) {
        return true;
    } else {
        return false;
    }
};

Entity.generateEntities = function(blueprintOfObject, x, z) {

    var entities = [];

    if (blueprintOfObject !== undefined) {
        for (var i = 0; i < blueprintOfObject.entities.length; i++) {
            var entityBlueprint = blueprintOfObject.entities[i];

            if (entityBlueprint.type == "cube") {
                var cube = Entity.createCube(
                    Utils.stringHexToHex(entityBlueprint.color),
                    entityBlueprint.scale,
                    entityBlueprint.position,
                    entityBlueprint.rotation
                );

                cube.position.x += x;
                cube.position.z += z;

                entities.push(cube);
            }
        }
    }

    return entities;
}
