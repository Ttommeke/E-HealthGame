var Serial = {
    chromeSerialExtention: chrome.serial,
    serialDevice: undefined,
    buffer: ""
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
    Serial.buffer += data;

    var indexOfBegin = Serial.buffer.indexOf("b");
    var indexOfEnd = Serial.buffer.indexOf("e");

    if (indexOfEnd != -1) {
        var command = Serial.buffer.substring(indexOfBegin + 1, indexOfEnd);
        Serial.buffer =  Serial.buffer.substring(indexOfEnd + 1);

        Motor.motors.motor1.setAngle(parseFloat(command));

        var motorUpdate = Motor.motors.motor1.readOutUpdate();
		var specialAngle = motorUpdate.angle - motorUpdate.previousAngle;
		if (specialAngle > 150) {
			specialAngle = specialAngle - 360;
		}
		if (specialAngle < -150) {
			specialAngle = specialAngle + 360;
		}

		Player.player.position.z += (specialAngle)/90;

        Serial.send("p\n");
    }
}

Serial.send = function(toSend) {
    if (Serial.serialDevice != undefined) {
		Serial.chromeSerialExtention.send(Serial.serialDevice.connectionId, Serial.str2ab(toSend), function(lala) {});
	}
};

Serial.connectToDevice = function(path) {
    return new Promise(function(resolve, reject) {
        Serial.chromeSerialExtention.connect(path, {
            bitrate: 115200
        }, function(serialDeviceBK) {
    		Serial.serialDevice = serialDeviceBK;

            console.log("Serial connection succesfull!");

            Serial.send("p\n");

            resolve();

            Serial.chromeSerialExtention.onReceive.addListener(function(info) {

                Serial.onReceive(Serial.ab2str(info.data));
            });
        });
    });
};

Serial.initSerial = function() {

    return new Promise(function(resolve, reject) {
        Serial.chromeSerialExtention.getDevices(function(data) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].displayName == "Arduino_Zero") {
                    return Serial.connectToDevice(data[i].path);
                }
            }

            reject("No device found!");
        });
    });

};
