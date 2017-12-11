const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

const Serial = require('./Serial.js');
const {ipcMain} = require('electron');

let motorLeft = {
    port: "",
    buffer: "",
    angle: 0,
    device: undefined
};
let motorRight = {
    port: "",
    angle: 0,
    device: undefined
};

let initMotor = function(motor, device) {
    motor.port = device.serialPort;
    motor.device = device;

    Serial.sendToDevice(motor.device, "p\n");

    motor.device.on("data", (data) => {

        if (data != "b" || data != "e" || data != "\n") {
            console.log("received: '" + data + "'" + parseFloat(data));
            motor.angle = parseFloat(data)*Math.PI/180;
            Serial.sendToDevice(motor.device, "p\n");
        }
        /*motor.buffer = data;

        var indexOfBegin = motor.buffer.indexOf("b");
        var indexOfEnd = motor.buffer.indexOf("e");

        if (indexOfEnd != -1) {
            var command = motor.buffer.substring(indexOfBegin + 1, indexOfEnd);
            motor.buffer =  motor.buffer.substring(indexOfEnd + 1);

            motor.angle.setAngle(parseFloat(command)*Math.PI/180);

            Serial.send(motor.device, "p\n");
        }*/
    });
};

ipcMain.on('ConnectToMotorLeft', (event, arg) => {
    Serial.connectToSerialmotor(motorRight.port).then((device) => {
        initMotor(motorLeft, device);

        event.returnValue = {
            result: "SUCCES"
        };
    }).catch((err) => {
        console.log(err);

        event.returnValue = {
            result: "FAIL"
        };
    });
});

ipcMain.on('ConnectToMotorRight', (event, arg) => {
    Serial.connectToSerialmotor(motorLeft.port).then((device) => {
        initMotor(motorRight, device);

        event.returnValue = {
            result: "SUCCES"
        };
    }).catch((err) => {
        console.log(err);

        event.returnValue = {
            result: "FAIL"
        };
    });
});

ipcMain.on('RequestAngles', (event, arg) => {

    event.returnValue = {
        left: motorLeft.angle,
        right: motorRight.angle
    };
});
