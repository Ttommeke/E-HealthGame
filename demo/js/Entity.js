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

Entity.createLine = function(start, end, myColor) {

    let material = new THREE.LineBasicMaterial({
    	color: myColor
    });

    let geometry = new THREE.Geometry();
    geometry.vertices.push( start.clone(), end.clone() );//new THREE.Vector3(start.x, start.y, start.z), new THREE.Vector3(end.x, end.y, end.z) );

    let line = new THREE.Line( geometry, material );
    return line;
}
