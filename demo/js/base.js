let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 4 );
renderer.setClearColor( 0xAAAAAA, 1 );
document.body.appendChild( renderer.domElement );


let startCube = Entity.createCube(1, 0xff0000);
scene.add( startCube );

let endCube = Entity.createCube(1, 0x0000ff);
endCube.position.x = 10;
endCube.position.y = 4;
scene.add( endCube );

let lineToFollow = Entity.createLine(startCube.position, endCube.position, 0x0000FF);
scene.add(lineToFollow);

let cube = Entity.createCube(1, 0x00ff00);
scene.add( cube );

let dirlight = new THREE.DirectionalLight( 0xFFFFFF );
scene.add( dirlight );

let hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( hemiLight );

camera.position.z = 12;
Motor.displayMotors(new THREE.Vector3( 0, -5, 0), 8, 1, 0.3, 0.2, 0.2);
Motor.motorLeft.onChangeCallback = function(oldAngle, newAngle) {
	let difference = newAngle - oldAngle;

	if (difference > Math.PI) {
		difference = difference - Math.PI*2;
	}
	if (difference < -Math.PI) {
		difference = Math.PI*2 + difference;
	}

	cube.position.x += difference/4;
}
Motor.motorRight.onChangeCallback = function(oldAngle, newAngle) {
	let difference = newAngle - oldAngle;

	if (difference > Math.PI) {
		difference = difference - Math.PI*2;
	}
	if (difference < -Math.PI) {
		difference = Math.PI*2 + difference;
	}

	cube.position.y += difference;
}

Serial.initSerial();

document.getElementById("bodyId").onkeydown = Events.keyDownEvent;
document.getElementById("bodyId").onkeyup = Events.keyUpEvent;

let angle = 0;

let lastPositionOfCube = cube.position.clone();

let animate = function () {
	requestAnimationFrame( animate );

	//cube.rotation.x += 0.1;
	//cube.rotation.y += 0.1;
	//startCube.rotation.x += 0.1;
	//startCube.rotation.y += 0.1;
	//endCube.rotation.x += 0.1;
	//endCube.rotation.y += 0.1;

	if (Events.keys.ArrowUp.isPressed() && !Events.keys.ArrowDown.isPressed()) {
        Motor.motorRight.setAngle(Motor.motorRight.angle + 0.05);
    }
    if (Events.keys.ArrowDown.isPressed() && !Events.keys.ArrowUp.isPressed()) {
        Motor.motorRight.setAngle(Motor.motorRight.angle - 0.05);
    }
    if (Events.keys.ArrowLeft.isPressed()) {
        Motor.motorLeft.setAngle(Motor.motorLeft.angle - 0.05);
    }
    if (Events.keys.ArrowRight.isPressed()) {
        Motor.motorLeft.setAngle(Motor.motorLeft.angle + 0.05);
    }

	if (!lastPositionOfCube.equals(cube.position) && lastPositionOfCube.distanceTo(cube.position) > 0.5) {
		let line = Entity.createLine(lastPositionOfCube, cube.position, 0x444444);
		scene.add(line);

		lastPositionOfCube = cube.position.clone();
	}

	renderer.render(scene, camera);
};

animate();
