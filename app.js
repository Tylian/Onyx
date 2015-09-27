var http = require("http");
var path = require("path");
var engine = require("engine.io");
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
	socket.on("disconnect", function() {
		console.log("Client disconnected with ID " + socket.id);
		socket.broadcast.emit("close", socket.id);
	});
	socket.on("move", function(x, y) {
		socket.x = x;
		socket.y = y;
		socket.broadcast.emit("move", socket.id, x, y);
	});

	socket.broadcast.emit("create", socket.id);
	for(id in io.sockets.connected) {
		if(id == socket.id) continue;
		socket.emit("create", id);
		socket.emit("move", id, io.sockets.connected[id].x, io.sockets.connected[id].y);
	}
});

app.listen(8080);