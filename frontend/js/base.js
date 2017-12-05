var scene = new THREE.Scene();
var serialDevice = undefined;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight-4);
document.body.appendChild( renderer.domElement );
var TimeClock = new THREE.Clock();
var fpsCounter = new Stats();
fpsCounter.showPanel(0);
document.body.appendChild( fpsCounter.dom );

document.getElementById("bodyId").onmousemove = Events.mouseMove;
document.getElementById("bodyId").onkeydown = Events.keyDownEvent;
document.getElementById("bodyId").onkeyup = Events.keyUpEvent;

Serial.initSerial().catch(function(error) {
	console.log(error);
});

var render = function() {
	fpsCounter.begin();
	var deltaTime = TimeClock.getDelta();

	if (Player.player != undefined) {
		Player.executeKeys(Player.player, deltaTime);

		var cameraPosition = new THREE.Vector3(
			Player.player.position.x + Camera.cameraInitialInfo.offset.x,
			Player.player.position.y + Camera.cameraInitialInfo.offset.y,
			Player.player.position.z + Camera.cameraInitialInfo.offset.z
		);

		Camera.moveCamera(Camera.camera, cameraPosition, deltaTime, Camera.speed);
	}

	renderer.render( scene, Camera.camera );
	fpsCounter.end();

	requestAnimationFrame( render );
}

$.getJSON("map.json", function(data) {

	Camera.speed = data.cameraSpeed;
	Camera.setCameraPositionAndRotation(Camera.camera, data.cameras[0]);
	Camera.cameraInitialInfo = data.cameras[0];

	data.lights.forEach(function(light) {
		scene.add(Light.generateLight(light));
	});

	var emap = Map.generateMapFromNumberMap(data.map, data.objectList);
	Map.loadMapInScene(emap, scene);

	Map.map = emap;

	renderer.setClearColor( Utils.stringHexToHex( data.clearcolor ), 1 );

	var player = Living.generateLiving(data.player);
	scene.add(player);
	Player.player = player;

	TimeClock.getDelta();
	render();
});
