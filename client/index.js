var io = require("socket.io-client");
var Client = require("./lib/client.js");

var clients = {};
var socket = io.connect("http://localhost:8080");
socket.on("connect", function() {
	socket.on("create", function(id) {
		clients[id] = new Client(id);
	});
	socket.on("move", function(id, x, y) {
		clients[id].move(x, y);
	});
	socket.on("close", function(id) {
		clients[id].destroy();
		delete clients[id];
	});
});

document.addEventListener("mousemove", function(e) {
	socket.emit("move", e.clientX, e.clientY);
});