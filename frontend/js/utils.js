
var Utils = {

};

Utils.addScalarVectorWitToOriginalVector = function(original, extra, direction) {
    var newV = new THREE.Vector3(0,0,0);
    newV.copy(original);

    newV.addScaledVector(direction, extra);

    return newV;
}

Utils.setXYZ = function( toCopyTo, toCopy) {
    toCopyTo.x = toCopy.x;
    toCopyTo.y = toCopy.y;
    toCopyTo.z = toCopy.z;
};

Utils.stringHexToHex = function(stringHex) {
    return parseInt(stringHex, 16);
};

Utils.findObjectWithIDInList = function(id, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            return list[i];
        }
    }

    return undefined;
};
