var io = require("socket.io-client");
var Client = require("./lib/client");
var Player = require("./lib/player");
var PIXI = require("pixi.js");

// Rendering
var renderer = new PIXI.autoDetectRenderer(800, 600, { backgroundColor : 0x1099bb });
document.getElementById("game_wrapper").appendChild(renderer.view);

var stage = new PIXI.Container();

// Networking
var entities = [];
var player;

function addEntity(entity) {
	entities.push(entity);
	stage.addChild(entity.container);
}
function findEntity(id) {
	var result = entities.filter(function(entity) {
		return entity.id == id;
	});
	return result ? result[0] : null;
}
function removeEntity(entity) {
	debugger;
	stage.removeChild(entity.container);
	entities.splice(entities.indexOf(entity), 1);
	entity.destroy();
}

var socket = io.connect("http://localhost:8080");
socket.on("connect", function() {
	player = new Player(socket);
	player.name = prompt("What is your name?", "Bob");
	socket.emit("name", player.name);

	socket.on("create", function(id) {
		addEntity(new Client(id));
	});
	socket.on("move", function(id, x, y, vx, vy) {
		var entity = findEntity(id);
		entity.move(x, y, vx, vy);
	});
	socket.on("name", function(id, name) {
		var entity = findEntity(id);
		entity.name = name;
	});
	socket.on("leave", function(id) {
		removeEntity(findEntity(id));
	});

	addEntity(player);
});

function update(delta) {
	entities.forEach(function(entity) {
		entity.update(delta);
	});
}

var lastFrame = 0;
requestAnimationFrame(function animate(t) {
	requestAnimationFrame(animate);
	var delta = t - lastFrame;
	lastFrame = t;

	update(delta / 1000);
	renderer.render(stage);
});

