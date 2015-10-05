module.exports = {
	lerp: function(a, b, k) {
		return a + (b - a) * k;
	},
	distance: function(x1, y1, x2, y2) {
		var xs = 0;
		var ys = 0;

		xs = x2 - x1;
		xs = xs * xs;

		ys = y2 - y1;
		ys = ys * ys;

		return Math.sqrt(xs + ys);
	},
	clamp: function(val, min, max) {
		return Math.max(Math.min(val, max), min);
	}
};