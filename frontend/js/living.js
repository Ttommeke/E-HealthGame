
var Living = {};

Living.checkCollision = function(living, map) {
    var x = living.position.x;
    var z = living.position.z;
    var xMinHitbox = x - living.hitbox.x/2;
    var zMinHitbox = z - living.hitbox.z/2;
    var xPlusHitbox = x + living.hitbox.x/2;
    var zPlusHitbox = z + living.hitbox.z/2;

    var minXIndex = Math.round(xMinHitbox);
    var minZIndex = Math.round(zMinHitbox);
    var plusXIndex = Math.round(xPlusHitbox);
    var plusZIndex = Math.round(zPlusHitbox);

    if (
        zMinHitbox < 0 ||
        xMinHitbox < 0 ||
        zPlusHitbox >= map.length - 1 ||
        xPlusHitbox >= map[Math.ceil(zPlusHitbox)].length - 1 ||
        Entity.areHitboxesTouching({
                "position": living.position,
                "hitbox": living.hitbox
            },{
                "position": { "x": minXIndex, "y": living.position.y, "z": minZIndex },
                "hitbox": map[minZIndex][minXIndex].objectBlueprint.hitbox
            }) ||
        Entity.areHitboxesTouching({
                "position": living.position,
                "hitbox": living.hitbox
            },{
                "position": { "x": minXIndex, "y": living.position.y, "z": plusZIndex },
                "hitbox": map[plusZIndex][minXIndex].objectBlueprint.hitbox
            }) ||
        Entity.areHitboxesTouching({
                "position": living.position,
                "hitbox": living.hitbox
            },{
                "position": { "x": plusXIndex, "y": living.position.y, "z": minZIndex },
                "hitbox": map[minZIndex][plusXIndex].objectBlueprint.hitbox
            }) ||
        Entity.areHitboxesTouching({
                "position": living.position,
                "hitbox": living.hitbox
            },{
                "position": { "x": plusXIndex, "y": living.position.y, "z": plusZIndex },
                "hitbox": map[plusZIndex][plusXIndex].objectBlueprint.hitbox
            })
    ) {
        return true;
    } else {
        return false;
    }
}

Living.moveLivingWithCollisionCheck = function(living, deltaTime, direction, speed, map) {
    var length = direction.length() + 0.00000001;

    var oriPos = living.position;
    oriPos.x += direction.x/length * speed * deltaTime;
    if (Living.checkCollision(living, map)) {
        oriPos.x -= direction.x/length * speed * deltaTime;
    }
    oriPos.y += direction.y/length * speed * deltaTime;
    if (Living.checkCollision(living, map)) {
        oriPos.y -= direction.y/length * speed * deltaTime;
    }
    oriPos.z += direction.z/length * speed * deltaTime;
    if (Living.checkCollision(living, map)) {
        oriPos.z -= direction.z/length * speed * deltaTime;
    }
/*
    Living.moveLiving(living, deltaTime, new THREE.Vector3(direction.x/length, 0, 0), speed);
    if (Living.checkCollision(living, map)) {
        Living.moveLiving(living, deltaTime, new THREE.Vector3(direction.x/length, 0, 0), -speed);
    }
    Living.moveLiving(living, deltaTime, new THREE.Vector3(0, direction.y/length, 0), speed);
    if (Living.checkCollision(living, map)) {
        Living.moveLiving(living, deltaTime, new THREE.Vector3( 0, direction.y/length, 0), -speed);
    }
    Living.moveLiving(living, deltaTime, new THREE.Vector3( 0, 0, direction.z/length), speed);
    if (Living.checkCollision(living, map)) {
        Living.moveLiving(living, deltaTime, new THREE.Vector3( 0, 0, direction.z/length), -speed);
    }*/
}

Living.moveLiving = function(living, deltaTime, direction, speed) {
    var length = direction.length() + 0.00000001;

    var oriPos = living.position;
    oriPos.x += direction.x/length * speed * deltaTime;
    oriPos.y += direction.y/length * speed * deltaTime;
    oriPos.z += direction.z/length * speed * deltaTime;
}

Living.generateLiving = function(living) {
    if (living.type = "human") {
        var human = Entity.createCube( 0xFF0099, new THREE.Vector3(0.8,1.4,0.8), living.position, living.rotation);
        human.position.y = 0.7;
        human.speed = living.speed;
        human.hitbox = living.hitbox;

        return human;
    }
}
