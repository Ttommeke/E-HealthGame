var Motor = {
    motors: {}
}

Motor.generateMotorObject = function() {
    var motorObject = {};

    motorObject.setAngle = function(angleUpdate) {
        if (motorObject.updated == false) {
            motorObject.previousAngle = motorObject.angle;
        }

        if (motorObject.angle != angleUpdate) {
            motorObject.updated = true;
        }
        motorObject.angle = angleUpdate;
    }

    motorObject.readOutUpdate = function() {
        var toReturn = { "updated": motorObject.updated, "previousAngle": motorObject.previousAngle, "angle": motorObject.angle}

        motorObject.updated = false;

        return toReturn;
    };

    motorObject.angle = 0;
    motorObject.previousAngle = 0;
    motorObject.updated = false;

    return motorObject;
}

Motor.motors.motor1 = Motor.generateMotorObject();
