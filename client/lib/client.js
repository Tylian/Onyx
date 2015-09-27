function Client(id) {
	this.id = id;
	this.x = 0;
	this.y = 0;

	var el = document.createElement("div");
	el.style.position = "absolute";
	document.body.appendChild(el);

	el.appendChild(document.createTextNode(id));

	this.el = el;
	this.move(0, 0);
}
Client.prototype.move = function(x, y) {
	this.x = x;
	this.y = y;
	this.el.style.left = this.x + "px";
	this.el.style.top = this.y + "px";
}
Client.prototype.destroy = function(x, y) {
	document.body.removeChild(this.el);
}

module.exports = Client;