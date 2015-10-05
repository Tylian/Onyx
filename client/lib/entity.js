var PIXI = require("pixi.js");
var util = require("./util");

function Entity() {
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;

	// Private properties
	this._name = "";

	// Rendering
	this.container = new PIXI.Container();

	var sprite = new PIXI.Sprite.fromImage("img/bunny.png")
	sprite.anchor.set(0.5, 1);
	sprite.position.set(16, 32);

	var text = new PIXI.Text("", {
		font: "bold 12px Arial",
		fill: "white",
		stroke: "black",
    	strokeThickness: 3
	});
	text.anchor.set(0.5, 1);
	text.position.x = 16;

	this.sprite = sprite;
	this.namePlate = text;

	this.container.addChild(sprite);
	this.container.addChild(text)

	// Other setup
	this.move(0, 0);
}
Entity.prototype.move = function(x, y, vx, vy) {
	this.x = x;
	this.y = y;
	this.container.position.set(x, y);

	if(arguments.length > 2) {
		this.vx = vx;
		this.vy = vy;
	}
}
Entity.prototype.update = function(delta) {
	if(this.isMoving()) {
		this.vx = util.clamp(this.vx, -120, 120);
		this.vy = util.clamp(this.vy, -120, 120);

		this.move(this.x + this.vx * delta, this.y + this.vy * delta);

		if(this.vx < 0.01 && this.vx > -0.01) {
			this.vx = 0;
		}
		if(this.vy < 0.01 && this.vy > -0.01) {
			this.vy = 0;
		}
	}
}
Entity.prototype.destroy = function() {
	// NOOP
}

Entity.prototype.isMoving = function() {
	return this.vx != 0 || this.vy !=0;
}

Object.defineProperties(Entity.prototype, {
	name: {
		get: function() { return this._name; },
		set: function(name) { this._name = name; this.namePlate.text = name; }
	}
})

module.exports = Entity;