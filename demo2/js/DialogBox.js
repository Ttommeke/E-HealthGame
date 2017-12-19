let DialogBox = {
    dialogBox: document.getElementById("dialog"),
    browseBox: document.getElementById("browse"),
    messageBox: document.getElementById("message"),
    confirmBox: document.getElementById("confirm"),
    cancelBox: document.getElementById("cancel")
};

DialogBox.init = function() {
    DialogBox.dialogBox = document.getElementById("dialog"),
    DialogBox.browseBox = document.getElementById("browse"),
    DialogBox.messageBox = document.getElementById("message"),
    DialogBox.confirmBox = document.getElementById("confirm"),
    DialogBox.cancelBox = document.getElementById("cancel")
};

DialogBox.selectFile = function() {
    const {dialog} = require('electron')
    dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
};

DialogBox.showSelectFileDialog = function(text) {
    return new Promise(function(resolve, reject) {
        DialogBox.dialogBox.style.display = "block";
        DialogBox.messageBox.innerHTML = text;
        DialogBox.confirmBox.style.display = "none";
        DialogBox.cancelBox.style.display = "block";
        DialogBox.browseBox.style.display = "block";
        DialogBox.browseBox.addEventListener("click", function() {
            DialogBox.dialogBox.style.display = "none";

            Ipc.getFile().then(function(fileData) {

                resolve(fileData);
            });
        });
        DialogBox.cancelBox.addEventListener("click", function() {
            reject("No file selected!");
        });
    });
}

DialogBox.showDialog = function(text) {
    return new Promise(function(resolve, reject) {
        DialogBox.dialogBox.style.display = "block";
        DialogBox.messageBox.innerHTML = text;
        DialogBox.confirmBox.style.display = "block";
        DialogBox.cancelBox.style.display = "none";
        DialogBox.browseBox.style.display = "none";
        DialogBox.confirmBox.addEventListener("click", function() {
            DialogBox.dialogBox.style.display = "none";
            resolve();
        });
    });
};
