const serialjs = require('serialport-js');

let connectToSerialmotor = (portname) => {
    return new Promise(function(resolve, reject) {
        const delimiter = '\n';

        console.log(portname);

        serialjs.open(portname, delimiter).then((device) => {

            if (device == undefined) {
                reject("No motor found!");
            } else {
                device.on('error', (error) => {
                    console.error(error);
                });

                resolve(device);
            }

        }).catch(function(err) {
            reject(err);
        });

    });

};

let sendToDevice = function(device, command) {
    device.send(command);
};

module.exports = {
    connectToSerialmotor: connectToSerialmotor,
    sendToDevice: sendToDevice
}
