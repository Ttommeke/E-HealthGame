const serialjs = require('serialport-js');

let connectToSerialmotor = (portNotToConnectTo) => {
    return new Promise(function(resolve, reject) {
        const delimiter = '\n';
        serialjs.find().then((ports) => {
            let found = false;

            for (let i = 0; i < ports.length; i++) {
                let port = ports[i];

                if (port.port != portNotToConnectTo) {
                    return serialjs.open(port.port, delimiter);
                }
            }

            if (!found) {
                reject("No motor found!");
            }
        }).then((device) => {
            device.on('error', (error) => {
                console.error(error);
            });

            resolve(device);
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
