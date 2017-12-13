let TextMessage = {
    textMessageDiv: document.getElementById("textMessageDiv"),
    textMessage: document.getElementById("textMessage")
};

TextMessage.init = function() {
    TextMessage.textMessageDiv = document.getElementById("textMessageDiv");
    TextMessage.textMessage = document.getElementById("textMessage");
};

TextMessage.showMessage = function(message) {
    TextMessage.textMessageDiv.style.display = "block";
    TextMessage.textMessage.innerHTML = message;
};

TextMessage.hideMessage = function() {
    TextMessage.textMessageDiv.style.display = "none";
};
