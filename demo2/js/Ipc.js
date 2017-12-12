let Ipc = {
    renderer: require('electron').ipcRenderer
};

Ipc.ConnectToMotorLeft = function() {
    return Ipc.renderer.sendSync('ConnectToMotorLeft', {});
};

Ipc.ConnectToMotorRight = function() {
    return Ipc.renderer.sendSync('ConnectToMotorRight', {});
};

Ipc.getAnglesOfMotors = function() {
    return Ipc.renderer.sendSync('RequestAngles', {});
};


Ipc.manipulateXAngle = function(angle) {
    return Ipc.renderer.sendSync('manipulateXAngle', { angle: angle });
};


Ipc.manipulateYAngle = function(angle) {
    return Ipc.renderer.sendSync('manipulateYAngle', { angle: angle });
};
