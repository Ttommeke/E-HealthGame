let DialogBox = {
    dialogBox: document.getElementById("dialog"),
    messageBox: document.getElementById("message"),
    confirmBox: document.getElementById("confirm")
};

DialogBox.init = function() {
    DialogBox.dialogBox = document.getElementById("dialog"),
    DialogBox.messageBox = document.getElementById("message"),
    DialogBox.confirmBox = document.getElementById("confirm")
};

DialogBox.showDialog = function(text) {
    return new Promise(function(resolve, reject) {
        DialogBox.dialogBox.style.display = "block";
        DialogBox.messageBox.innerHTML = text;
        DialogBox.confirmBox.addEventListener("click", function() {
            DialogBox.dialogBox.style.display = "none";
            resolve();
        });
    });
};
