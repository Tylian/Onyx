var Client = require("./client");
var PIXI = require("pixi.js");
var Keys = require("./keys");

function Player(socket) {
	Client.call(this, socket.id);
	this.id = socket.id;
	this.socket = socket;
	
	document.addEventListener("keydown", this._keyDown.bind(this), true);
	document.addEventListener("keyup", this._keyUp.bind(this), true);

	this._keyStates = {};
	this._dirty = false;
}
Player.prototype = Object.create(Client.prototype);
Player.prototype.constructor = Player;

// Events
Player.prototype._keyDown = function(e) {
	this._keyStates[e.which] = true;
};
Player.prototype._keyUp = function(e) {
	this._keyStates[e.which] = false;
};

// Updating
Player.prototype.update = function(delta) {
	var oldVx = this.vx;
	var oldVy = this.vy;

	if(this._keyStates[Keys.VK_W]) {
		this.vy = -120;
	} else if(this._keyStates[Keys.VK_S]) {
		this.vy = 120;
	} else {
		this.vy = 0;
	}

	if(this._keyStates[Keys.VK_A]) {
		this.vx = -120;
	} else if(this._keyStates[Keys.VK_D]) {
		this.vx = 120;
	} else {
		this.vx = 0;
	}

	// Move it
	Client.prototype.update.call(this, delta);
	if(this.vx != oldVx || this.vy != oldVy) {
		this.socket.emit("move", this.x, this.y, this.vx, this.vy);
	}
};


module.exports = Player;