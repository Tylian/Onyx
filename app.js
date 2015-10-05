var http = require("http");
var path = require("path");
var fs = require("fs");

var app = http.createServer(function(req, res) {
	var url = require("url").parse(req.url, true);
	if(url.pathname == "/") url.pathname = "/index.html";
	fs.readFile(path.join(__dirname, "public", url.pathname), function(err,data) {
		if (err) {
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		}
		res.writeHead(200);
		res.end(data);
	});
});

var io = require('socket.io')(app);
io.on("connection", function(socket) {
	console.log("Client connected with ID " + socket.id);

	socket.x = 0;
	socket.y = 0;
	socket.vx = 0;
	socket.vy = 0;
	socket.name = socket.id;

	socket.on("disconnect", function() {
		console.log("Client disconnected with ID " + socket.id);
		socket.broadcast.emit("leave", socket.id);
	});

	socket.on("move", function(x, y, vx, vy) {
		var oldX = socket.x;
		var oldY = socket.y;

		socket.x = x;
		socket.y = y;

		socket.vx = vx;
		socket.vy = vy;

		socket.broadcast.emit("move", socket.id, x, y, vx, vy);
	});
	socket.on("name", function(name) {
		socket.name = name;
		socket.broadcast.emit("name", socket.id, name);
	});

	socket.broadcast.emit("create", socket.id);
	for(id in io.sockets.connected) {
		if(id == socket.id) continue;

		var them = io.sockets.connected[id];
		socket.emit("create", id);
		socket.emit("move", id, them.x, them.y, them.vx, them.vy);
		socket.emit("name", id, them.name);
	}
});

app.listen(8080);