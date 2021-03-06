var UI = {
	show: function(d) {
		if (UI.getStyle(d, "display") == "none") {
			var b = window.getMatchedCSSRules(d, "", true);
			var f = b.length;
			var e;
			for (var c = f - 1; c >= 0; --c) {
				e = b[c].style.display;
				if (e && e != "none") {
					d.style.display = e;
					return
				}
			}
			var a = document.createElement(d.nodeName);
			document.body.appendChild(a);
			e = UI.getStyle(a, "display");
			document.body.removeChild(a);
			d.style.display = e
		}
	},
	hide: function(a) {
		a.style.display = "none"
	},
	setStyle: function(b) {
		var e = arguments.length;
		var a = arguments[1];
		if (e == 2 && a.constructor == Object) {
			for (var d in a) {
				var c = d.replace(/-([a-z])/gi, function(g, f) {
					return f.toUpperCase()
				});
				b.style[c] = a[d]
			}
		} else {
			if (e == 3) {
				b.style[a] = arguments[2]
			}
		}
	},
	getStyle: function(a, b) {
		return window.getComputedStyle(a)[b]
	},
	addClass: function(b, c) {
		var a = b.className.split(" ");
		a.push(c);
		b.className = a.join(" ")
	},
	removeClass: function(c, d) {
		var b = c.className.split(" ");
		var a = b.indexOf(d);
		if (a >= 0) {
			b.splice(a, 1);
			c.className = b.join(" ")
		}
	},
	addStyleSheet: function(b) {
		var a = document.createElement("link");
		a.setAttribute("type", "text/css");
		a.setAttribute("rel", "stylesheet");
		a.setAttribute("href", b);
		document.head.appendChild(a)
	}
};