function Canvas() {}
Canvas.prototype.drawStrokeRect = function(d, e, c, g, f, b, a) {
	d.strokeStyle = e;
	d.lineWidth = a;
	d.strokeRect(c, g, f, b)
};
Canvas.prototype.drawFillRect = function(c, d, b, f, e, a) {
	c.fillStyle = d;
	c.fillRect(b, f, e, a)
};
Canvas.prototype.drawEllipse = function(m, d, l, k, b, a, h, j) {
	var g = l + b;
	var f = k;
	m.beginPath();
	m.lineWidth = h;
	m.moveTo(g, f);
	for (var e = 0; e <= 360; e++) {
		var c = e * Math.PI / 180;
		g = l + (b - 2) * Math.cos(c);
		f = k - (a - 2) * Math.sin(c);
		m.lineTo(g, f)
	}
	if (j == "rect") {
		m.fillStyle = changeColorToRgba(d, 0.5);
		m.fill()
	} else {
		if (j == "border") {
			m.strokeStyle = d;
			m.stroke()
		}
	}
	m.closePath()
};
Canvas.prototype.getLines = function(l, k, c, d) {
	var g = k.split(" ");
	var m = [];
	var h = "";
	var b = 0;
	l.font = d;
	for (var f = 0; f < g.length; f++) {
		var a = g[f];
		b = l.measureText(h + a).width;
		if (b <= c || a == "") {
			h += a + " "
		} else {
			if (h != "") {
				m.push(h)
			}
			b = l.measureText(a).width;
			if (b <= c) {
				h = a + " "
			} else {
				h = a[0];
				for (var e = 1; e < a.length; e++) {
					b = l.measureText(h + a[e]).width;
					if (b <= c) {
						h += a[e]
					} else {
						m.push(h);
						h = a[e]
					}
				}
				h += " "
			}
		}
	}
	if (h != "") {
		m.push(h)
	}
	return m
};
Canvas.prototype.setText = function(j, h, b, l, d, g, f, e, a) {
	j.textBaseline = "top";
	j.fillStyle = b;
	j.font = l + " " + d;
	j.lineHeight = g;
	var k = Canvas.prototype.getLines(j, h, a - 2, j.font);
	for (var c = 0; c < k.length; c++) {
		j.fillText(k[c], f, e + g * c, a)
	}
};
Canvas.prototype.drawLine = function(d, e, h, b, c, a, g, f) {
	d.beginPath();
	d.moveTo(c, a);
	d.strokeStyle = e;
	d.lineWidth = b;
	d.lineCap = h;
	d.lineTo(g, f);
	d.closePath();
	d.stroke()
};
Canvas.prototype.drawArrow = function(k, b, g, d, c, j, f, e, i, h) {
	var a = calculateArrowCoordinates(d, c, f, e, i, h);
	k.beginPath();
	k.strokeStyle = b;
	k.lineWidth = g;
	k.lineCap = j;
	k.moveTo(f, e);
	k.lineTo(i, h);
	k.lineTo(a.p1.x, a.p1.y);
	k.moveTo(i, h);
	k.lineTo(a.p2.x, a.p2.y);
	k.closePath();
	k.stroke()
};
Canvas.prototype.drawRoundedRect = function(d, e, c, h, g, b, a, f) {
	d.beginPath();
	d.moveTo(c, h + a);
	d.lineTo(c, h + b - a);
	d.quadraticCurveTo(c, h + b, c + a, h + b);
	d.lineTo(c + g - a, h + b);
	d.quadraticCurveTo(c + g, h + b, c + g, h + b - a);
	d.lineTo(c + g, h + a);
	d.quadraticCurveTo(c + g, h, c + g - a, h);
	d.lineTo(c + a, h);
	d.quadraticCurveTo(c, h, c, h + a);
	if (f == "rect") {
		d.fillStyle = changeColorToRgba(e, 0.5);
		d.fill()
	} else {
		if (f == "border") {
			d.strokeStyle = e;
			d.lineWidth = 2;
			d.stroke()
		}
	}
	d.closePath()
};
Canvas.prototype.blurImage = function(k, i, c, e, d, n, l) {
	var h = e < n ? e : n;
	var g = d < l ? d : l;
	var b = Math.abs(n - e - 1);
	var j = Math.abs(l - d - 1);
	i.width = $(c).clientWidth + 10;
	i.height = $(c).clientHeight + 10;
	var m = i.getContext("2d");
	try {
		m.drawImage(k, h, g, b, j, 0, 0, b, j)
	} catch (f) {
		console.log(f + ", width : height = " + b + " : " + j)
	}
	var a = m.getImageData(0, 0, b, j);
	a = this.boxBlur(a, b, j, 10);
	m.putImageData(a, 0, 0)
};
Canvas.prototype.boxBlur = function(d, a, r, o) {
	var g;
	var q = d.data;
	var t = 0;
	var s = 0;
	var b = 0;
	var f;
	var n;
	var p;
	for (f = 0; f < 2; f++) {
		if (f) {
			s = a;
			t = r;
			b = a * 4
		} else {
			s = r;
			t = a;
			b = 4
		}
		for (var h = 0; h < s; h++) {
			n = (f == 0 ? (h * a * 4) : (4 * h));
			for (var e = 0; e < 4; e++) {
				p = n + e;
				var l = 0;
				for (var c = 0; c < o; c++) {
					l += q[p + b * c]
				}
				q[p] = q[p + b] = q[p + b * 2] = Math.floor(l / o);
				for (g = 3; g < t - 2; g++) {
					l = Math.max(0, l - q[p + (g - 2) * b] + q[p + (g + 2) * b]);
					q[p + g * b] = Math.floor(l / o)
				}
				q[p + g * b] = q[p + (g + 1) * b] = Math.floor(l / o)
			}
		}
	}
	return d
};

function changeColorToRgba(b, c) {
	var e = b.toLowerCase();
	var a = [];
	for (var d = 1; d < e.length; d += 2) {
		a.push(parseInt("0x" + e.slice(d, d + 2)))
	}
	return "rgba(" + a.join(",") + "," + c + ")"
}

function calculateArrowCoordinates(c, d, b, a, f, e) {
	var h = function() {
		var i = b - f;
		var m = a - e;
		var l = Math.sqrt(i * i + m * m);
		l = (l == 0 ? d : l);
		var k = Math.round(i / l * d);
		var j = Math.round(m / l * d);
		return {
			x: f + k,
			y: e + j
		}
	};
	var g = function(m, o) {
		var i = m.x - b;
		var n = m.y - a;
		var l = Math.sqrt(i * i + n * n);
		l = (l == 0 ? d : l);
		var k = Math.round((n / l * c) * o);
		var j = Math.round((i / l * c) * o);
		return {
			x: m.x + k,
			y: m.y - j
		}
	};
	return {
		p1: g(h(), 1),
		p2: g(h(), -1)
	}
};