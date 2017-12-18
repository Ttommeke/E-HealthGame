const serialjs = require('serialport-js');

let connectToSerialmotor = (portNotToConnectTo) => {
    return new Promise(function(resolve, reject) {
        const delimiter = '\n';
        serialjs.find().then((ports) => {

            for (let i = 0; i < ports.length; i++) {
                let port = ports[i];

                if (port.port != portNotToConnectTo) {
                    return serialjs.open(port.port, delimiter);
                }
            }
        }).then((device) => {

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
