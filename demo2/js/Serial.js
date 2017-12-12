var Serial = {
    chromeSerialExtention: chrome.serial,
    serialDevice: undefined,
    buffer: "",
    motorLeft: {
        path: "",
        serialDevice: undefined,
        motorObject: undefined,
        buffer: ""
    },
    motorRight: {
        path: "",
        serialDevice: undefined,
        motorObject: undefined,
        buffer: ""
    }
    //onReceive: function(data) { console.log(data); }
};

/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
Serial.ab2str = function(buf) {
    var bufView = new Uint8Array(buf);
    var encodedString = String.fromCharCode.apply(null, bufView);

    return decodeURIComponent(escape(encodedString));
};

/* Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer. */
Serial.str2ab = function(str) {
    var encodedString = unescape(encodeURIComponent(str));
    var bytes = new Uint8Array(encodedString.length);

    for (var i = 0; i < encodedString.length; ++i) {
        bytes[i] = encodedString.charCodeAt(i);
    }

    return bytes.buffer;
};

Serial.onReceive = function(data) {

    let motor = Serial.motorRight;
    if (data.connectionId == Serial.motorLeft.serialDevice.connectionId) {
        motor = Serial.motorLeft;
    }

    motor.buffer += Serial.ab2str(data.data);

    var indexOfEnd = motor.buffer.indexOf("\n");


    if (indexOfEnd != -1) {
        var command = motor.buffer.substring(0, indexOfEnd);
        console.log(command);
        motor.buffer =  motor.buffer.substring(indexOfEnd + 1);


        motor.motorObject.setAngle(parseFloat(command)*Math.PI/180);

        Serial.send(motor.serialDevice, "p\n");
    }
}

Serial.send = function( serialDevice, toSend) {
	Serial.chromeSerialExtention.send(serialDevice.connectionId, Serial.str2ab(toSend), function(lala) {});
};

Serial.initConnectionMotor = function( motor, takenPath) {
    return new Promise(function(resolve, reject) {

        Serial.chromeSerialExtention.getDevices(function(data) {

            let found = false;

            for (var i = 0; i < data.length; i++) {
                let path = data[i].path;
                if (!found && data[i].displayName == "Arduino_Zero" && path != takenPath) {
                    found = true;
                    Serial.chromeSerialExtention.connect(path, {
                        bitrate: 115200
                    }, function(serialDeviceBK) {
                		motor.serialDevice = serialDeviceBK;
                        motor.path = path;

                        console.log("Serial connection succesfull!");

                        resolve();
                    });
                }
            }

            if (!found) {
                reject("No device found!");
            }
        });
    });
}

Serial.initSerial = function() {

    Serial.motorLeft.motorObject = Motor.motorLeft;
    Serial.motorRight.motorObject = Motor.motorRight;

    return new Promise(function(resolve, reject) {

        DialogBox.showDialog("Connect left motor").then(function() {
            return Serial.initConnectionMotor(Serial.motorLeft, "");
        }).then(function() {
            return DialogBox.showDialog("Connect right motor");
        }).then(function() {
            return Serial.initConnectionMotor(Serial.motorRight, Serial.motorLeft.path);
        }).then(function() {
            return DialogBox.showDialog("Setup succesfull!");
        }).then(function() {
            Serial.send(Serial.motorLeft.serialDevice, "p\n");
            Serial.send(Serial.motorRight.serialDevice, "p\n");

            Serial.chromeSerialExtention.onReceive.addListener(function(info) {
                Serial.onReceive(info);
            });
        });

    });

};
