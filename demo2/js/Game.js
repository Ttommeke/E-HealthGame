let Game = {
    games: [],
    activeGameIndex: 0,
    busy: false,
    countDown: false,
    startCube: Entity.createCube(0.2, 0xff0000),
    endCube: Entity.createCube(0.2, 0x0000ff),
    lineToFollow: undefined,
    cilinder: Entity.createCylinder(0.3,0.2, 0x00ff00),
    cilinderToFolow: Entity.createCylinder(0.3,0.2, 0x00ffff),
    lines: [],
    startTime: 0,
    dimensions: {
        x: 5,
        y: 5
    }
};

Game.loadNewGames = function(gameFilePath) {
    Game.games = gameFilePath;
};

Game.startCountDown = function() {
    let number = 3;

    let callback = function() {
        if (number == 0) {
            Motor.setPosition(new THREE.Vector3( 0, 20, 0), 20);
            Game.startTime = performance.now();
            Game.countDown = false;
            TextMessage.hideMessage();
        } else {
            TextMessage.showMessage(number);
            number--;

            setTimeout(callback, 1000);
        }
    }

    callback();
};

Game.startRound = function() {
    Game.countDown = true;
    Game.busy = true;

    for (let i = 0; i < Game.lines.length; i++) {
        scene.remove(Game.lines[i]);
    }

    Game.lines = [];

    Game.cilinder.position.x = 0;
    Game.cilinder.position.y = 0;

    Game.cilinderToFolow.position.x = 0;
    Game.cilinderToFolow.position.y = 0;

    lastPositionOfCube.x = 0;
    lastPositionOfCube.y = 0;

    Game.endCube.position.x = Game.dimensions.x / Game.games[Game.activeGameIndex].posX;
    Game.endCube.position.y = Game.dimensions.y / Game.games[Game.activeGameIndex].posY;
    scene.remove(Game.lineToFollow);
    Game.lineToFollow = Entity.createLine(Game.startCube.position, Game.endCube.position, 0x0000FF);
    scene.add(Game.lineToFollow);

    Game.startCountDown();
};

Game.endRound = function() {

    Motor.setPosition(new THREE.Vector3( 0, 7, 0), 20);

    Game.busy = false;
    TextMessage.showMessage("Ended!");

    Game.activeGameIndex++;

    if (Game.games[Game.activeGameIndex] == undefined) {
        Game.doneWithGames();
    }
}

Game.doneWithGames = function() {
    DialogBox.showDialog("Done with all exercises!");
}
