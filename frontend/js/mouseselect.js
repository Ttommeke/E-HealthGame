
var MouseSelect = {
    raycaster: new THREE.Raycaster(),
    plane: new THREE.Plane( new THREE.Vector3(0,1,0), 0 )
};

MouseSelect.positionWhereMouseLooksOnYAxisFromCenterPoint = function(yLevel, camera, posMouse) {
    var mouseX = posMouse.x;
    var mouseY = posMouse.z;

    MouseSelect.raycaster.setFromCamera( {x: mouseX, y: mouseY}, camera );
    MouseSelect.plane.setComponents(0,-1,0,yLevel);

    return MouseSelect.raycaster.ray.intersectPlane(MouseSelect.plane);
};
