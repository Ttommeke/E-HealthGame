let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 4 );
renderer.setClearColor( 0xAAAAAA, 1 );
document.body.appendChild( renderer.domElement );

scene.add( Game.startCube );

scene.add( Game.endCube );

scene.add( Game.cilinderToFolow );

Game.lineToFollow = Entity.createLine(Game.startCube.position, Game.endCube.position, 0x0000FF);
scene.add( Game.lineToFollow );

Game.cilinder = Entity.createCylinder(0.3,0.2, 0x00ff00);
Game.cilinderToFolow.rotation.x = Math.PI/2;
Game.cilinder.rotation.x = Math.PI/2;
scene.add( Game.cilinder );

let dirlight = new THREE.DirectionalLight( 0xFFFFFF );
scene.add( dirlight );

let hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( hemiLight );

camera.position.z = 12;
Motor.displayMotors(new THREE.Vector3( 0, 7, 0), 20, 1, 0.3, 0.2, 0.2);
Motor.motorLeft.onChangeCallback = function(oldAngle, newAngle) {
	let difference = newAngle - oldAngle;

	if (difference > Math.PI) {
		difference = difference - Math.PI*2;
	}
	if (difference < -Math.PI) {
		difference = Math.PI*2 + difference;
	}

	if (Game.busy && !Game.countDown) {
		Game.cilinder.position.x += difference*Game.games[Game.activeGameIndex].speedFactorCube;
	}
}
Motor.motorRight.onChangeCallback = function(oldAngle, newAngle) {
	let difference = newAngle - oldAngle;

	if (difference > Math.PI) {
		difference = difference - Math.PI*2;
	}
	if (difference < -Math.PI) {
		difference = Math.PI*2 + difference;
	}

	if (Game.busy && !Game.countDown) {
		Game.cilinder.position.y += difference*Game.games[Game.activeGameIndex].speedFactorCube;
	}
}
DialogBox.init();
TextMessage.init();

document.getElementById("bodyId").onkeydown = Events.keyDownEvent;
document.getElementById("bodyId").onkeyup = Events.keyUpEvent;

let angle = 0;

let lastPositionOfCube = Game.cilinder.position.clone();

DialogBox.showDialog("Connect left motor").then(function() {
	Ipc.ConnectToMotorLeft();
	return DialogBox.showDialog("Connect right motor");
}).then(function() {
	Ipc.ConnectToMotorRight();
	return DialogBox.showDialog("Setup succesfull!");
}).then(function() {
	return DialogBox.showSelectFileDialog("Open a test file.");
}).then(function(file) {
	Game.loadNewGames(file);
}).catch(function(err) {
	console.log(err);
	DialogBox.showDialog("Setup failed!");
});

let animate = function () {
	requestAnimationFrame( animate );

    let angles = Ipc.getAnglesOfMotors();
	Motor.motorLeft.setAngle(angles.left);
	Motor.motorRight.setAngle(angles.right);

	//cube.rotation.x += 0.1;
	//cube.rotation.y += 0.1;
	//startCube.rotation.x += 0.1;
	//startCube.rotation.y += 0.1;
	//endCube.rotation.x += 0.1;
	//endCube.rotation.y += 0.1;

	if (Events.keys.ArrowUp.isPressed() && !Events.keys.ArrowDown.isPressed()) {
        Ipc.manipulateYAngle(Motor.motorRight.angle + 0.05);
    }
    if (Events.keys.ArrowDown.isPressed() && !Events.keys.ArrowUp.isPressed()) {
        Ipc.manipulateYAngle(Motor.motorRight.angle - 0.05);
    }
    if (Events.keys.ArrowLeft.isPressed() && !Events.keys.ArrowRight.isPressed()) {
        Ipc.manipulateXAngle(Motor.motorLeft.angle - 0.05);
    }
    if (Events.keys.ArrowRight.isPressed() && !Events.keys.ArrowLeft.isPressed()) {
        Ipc.manipulateXAngle(Motor.motorLeft.angle + 0.05);
    }

	if (Game.busy) {

		if (!Game.countDown) {
			let elapsedTime = (performance.now() - Game.startTime) / 1000;

			let percentageOfPosition = elapsedTime/Game.games[Game.activeGameIndex].time;
			Game.cilinderToFolow.position.x = percentageOfPosition * Game.endCube.position.x;
			Game.cilinderToFolow.position.y = percentageOfPosition * Game.endCube.position.y;

			if (!lastPositionOfCube.equals(Game.cilinder.position) && lastPositionOfCube.distanceTo(Game.cilinder.position) > 0.1) {
				let line = Entity.createLine(lastPositionOfCube, Game.cilinder.position, 0x444444);
				Game.lines.push(line);
				scene.add(line);

				lastPositionOfCube = Game.cilinder.position.clone();
			}

			if (elapsedTime >= Game.games[Game.activeGameIndex].time) {
				Game.endRound();
			}
		}

	} else {
		if (Motor.motorLeft.isUpright() && Motor.motorRight.isUpright()) {
	        Game.startRound();
	    }
	}

	renderer.render(scene, camera);
};

animate();
