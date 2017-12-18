let Game = {
    games: [],
    activeGameIndex: 0
};

Game.loadNewGames = function(gameFilePath) {
    
};

Game.startRound = function() {
    TextMessage.showMessage("Start!");
    let callback = function() {
    	TextMessage.hideMessage();
    }
    setTimeout(callback, 5000);
};
