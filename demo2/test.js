const serialjs = require('serialport-js');
serialjs.find().then((ports) => {
    let found = false;

    for (let i = 0; i < ports.length; i++) {
        let port = ports[i];

        if (port.port != "") {
            return serialjs.open(port.port, "\n");
        }
    }
}).then((device) => {
    let callback = function() {
        device.send("p");
    }

    device.on('error', (error) => {
        console.error(error);
    });

    device.on("data", function(data) {
        console.log(data);
        setTimeout( callback, 20);
    });

    device.send("p");
});
