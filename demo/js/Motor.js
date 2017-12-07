"use strict";

let Motor = {
    motorLeft: undefined,
    motorRight: undefined,
    radiusMotor: 2.5,
    heightMotor: 0.5,
    radiusFingerNob: 0.5,
    heightFingerNob: 0.5
};

Motor.displayMotors = function(position, distanceBetweenMotors, radiusMotor, radiusFingerNob, heightMotor, heightFingerNob) {

    Motor.motorLeft = Motor.createMotor(radiusMotor, radiusFingerNob, heightMotor, heightFingerNob);
    Motor.motorRight = Motor.createMotor(radiusMotor, radiusFingerNob, heightMotor, heightFingerNob);

    let posLeft = new THREE.Vector3(position.x - distanceBetweenMotors/2, position.y, position.z);
    let posRight = new THREE.Vector3(position.x + distanceBetweenMotors/2, position.y, position.z);


    Motor.motorLeft.setPosition(new THREE.Vector3( -5, -5, 0));
    Motor.motorRight.setPosition(new THREE.Vector3( 5, -5, 0));

    scene.add(Motor.motorLeft.bigCilinder);
    scene.add(Motor.motorLeft.smallCilinder);
    scene.add(Motor.motorRight.bigCilinder);
    scene.add(Motor.motorRight.smallCilinder);
};

Motor.createMotor = function( radiusMotor, radiusFingerNob, heightMotor, heightFingerNob) {
    let newMotor = {};
    let distanceOfNobFromCenterMotor = radiusMotor*2/3;

    newMotor.bigCilinder = Entity.createCylinder( radiusMotor, heightMotor, 0xAAAAAA);
    newMotor.smallCilinder = Entity.createCylinder( radiusFingerNob, heightFingerNob, 0x777777);

    newMotor.bigCilinder.rotation.x = Math.PI/2;
    newMotor.smallCilinder.rotation.x = Math.PI/2;

    newMotor.angle = 0;

    newMotor.onChangeCallback = function(oldAngle, newAngle) {
    }

    newMotor.setPosition = function(position) {
        newMotor.bigCilinder.position.set(position.x, position.y, position.z);
        let positionSmallCilinder = new THREE.Vector3(position.x, position.y + distanceOfNobFromCenterMotor, position.z + heightFingerNob/2 + heightMotor/2);
        newMotor.smallCilinder.position.set(positionSmallCilinder.x, positionSmallCilinder.y, positionSmallCilinder.z);
    }

    newMotor.setAngle = function(angle) {
        newMotor.onChangeCallback(newMotor.angle, angle);
        newMotor.angle = angle;
        let spherical = new THREE.Spherical(distanceOfNobFromCenterMotor, Math.PI/2, -angle);

        let positionSmallCilinder = new THREE.Vector3( distanceOfNobFromCenterMotor, 0, heightFingerNob/2 + heightMotor/2);
        positionSmallCilinder.setFromSpherical(spherical);
        newMotor.smallCilinder.position.x = newMotor.bigCilinder.position.x - positionSmallCilinder.x;
        newMotor.smallCilinder.position.y = newMotor.bigCilinder.position.y + positionSmallCilinder.z;
        newMotor.smallCilinder.position.z = newMotor.bigCilinder.position.z + heightFingerNob/2 + heightMotor/2;
    }

    return newMotor;
};
