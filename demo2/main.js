const {app, BrowserWindow, dialog} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

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
    angle: Math.PI/3,
    device: undefined
};
let motorRight = {
    port: "",
    angle: Math.PI/6,
    device: undefined
};

let initMotor = function(motor, device) {
    motor.port = device.serialPort;
    motor.device = device;

    Serial.sendToDevice(motor.device, "p\n");

    motor.device.on("data", (data) => {
        let callback = function() {
            Serial.sendToDevice(motor.device, "p\n");
        }

        console.log("received: " + data ,parseFloat(data));

        if (!isNaN(parseFloat(data))) {
            motor.angle = parseFloat(data)*Math.PI/180;
            setTimeout(callback, 10);
        }
    });
};

ipcMain.on('ConnectToMotorLeft', (event, arg) => {
    Serial.connectToSerialmotor(motorRight.port).then((device) => {

        initMotor(motorLeft, device);
        console.log(device);
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

ipcMain.on('getFile', (event, arg) => {
    let fileName = dialog.showOpenDialog({
        title: "Open Excercise",
        properties: ['openFile'],
        filters: [
            {name: 'json', extensions: ['json']}
        ]
    });

    if (fileName !== undefined) {
        fs.readFile(fileName[0], 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }

            event.sender.send('newFile', JSON.parse(data));
        });
    }
    else {
        event.sender.send('newFile', undefined);
    }
});

ipcMain.on('manipulateXAngle', (event, arg) => {
    motorLeft.angle = arg.angle;

    event.returnValue = {
        result: "SUCCES"
    };
});

ipcMain.on('manipulateYAngle', (event, arg) => {
    motorRight.angle = arg.angle;

    event.returnValue = {
        result: "SUCCES"
    };
});
