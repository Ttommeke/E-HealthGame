"use strict";

let Entity = {};

Entity.createCylinder = function(radius, height, myColor) {
    let geometry = new THREE.CylinderGeometry( radius, radius, height, 32 );
    let material = new THREE.MeshLambertMaterial( { color: myColor } );
    let cylinder = new THREE.Mesh( geometry, material );
    return cylinder;
}

Entity.createCube = function(size, myColor) {
    let geometry = new THREE.BoxGeometry( size, size, size );
    let material = new THREE.MeshLambertMaterial( { color: myColor } );
    let cube = new THREE.Mesh( geometry, material );
    return cube;
}
