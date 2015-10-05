var Entity = require("./entity.js");
var PIXI = require("pixi.js");

function Client(id) {
	Entity.apply(this);
	this.id = id;
	
	this.name = id;
}
Client.prototype = Object.create(Entity.prototype);
Client.prototype.constructor = Client;

module.exports = Client;