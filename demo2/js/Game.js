let Game = {

};

Game.startRound = function() {
    TextMessage.showMessage("Start!");
    let callback = function() {
    	TextMessage.hideMessage();
    }
    setTimeout(callback, 5000);
}