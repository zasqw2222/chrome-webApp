var __screenCapturePageContext__ = {
	clone: function(b) {
		function c() {}
		c.prototype = b;
		var a = new c();
		a.getInternalObject = function() {
			return this.__proto__
		};
		a.toString = function() {
			try {
				return this.__proto__.toString()
			} catch (d) {
				return "object Object"
			}
		};
		return a
	},
	bind: function(d, c) {
		var a = [];
		for (var b = 2; b < arguments.length; b++) {
			a.push(arguments[b])
		}
		return function() {
			return c.apply(d, a)
		}
	},
	bodyWrapperDelegate_: null,
	currentHookStatus_: false,
	scrollValueHooker: function(a, c, b) {
		return 0
	},
	toggleBodyScrollValueHookStatus: function() {
		this.currentHookStatus_ = !this.currentHookStatus_;
		if (this.currentHookStatus_) {
			var b = this;
			try {
				document.__defineGetter__("body", function() {
					return b.bodyWrapperDelegate_.getWrapper()
				})
			} catch (a) {
				window.console.log("error" + a)
			}
			this.bodyWrapperDelegate_.watch("scrollLeft", this.scrollValueHooker);
			this.bodyWrapperDelegate_.watch("scrollTop", this.scrollValueHooker)
		} else {
			this.bodyWrapperDelegate_.unwatch("scrollLeft", this.scrollValueHooker);
			this.bodyWrapperDelegate_.unwatch("scrollTop", this.scrollValueHooker);
			var b = this;
			try {
				document.__defineGetter__("body", function() {
					return b.bodyWrapperDelegate_.getWrapper().getInternalObject()
				})
			} catch (a) {
				window.console.log("error" + a)
			}
		}
	},
	checkHookStatus: function() {
		var a = document.documentElement.getAttributeNode("__screen_capture_need_hook_scroll_value__");
		a = !!(a && a.nodeValue == "true");
		if (this.currentHookStatus_ != a) {
			this.toggleBodyScrollValueHookStatus()
		}
	},
	init: function() {
		if (!this.bodyWrapperDelegate_) {
			this.bodyWrapperDelegate_ = new __screenCapturePageContext__.ObjectWrapDelegate(document.body, "^(DOCUMENT_[A-Z_]+|[A-Z_]+_NODE)$");
			document.documentElement.addEventListener("__screen_capture_check_hook_status_event__", __screenCapturePageContext__.bind(this, this.checkHookStatus))
		}
	}
};
__screenCapturePageContext__.ObjectWrapDelegate = function(g, a) {
	this.window_ = window;
	this.wrapper_ = __screenCapturePageContext__.clone(g);
	this.properties_ = [];
	this.watcherTable_ = {};
	if (typeof a == "undefined") {
		a = ""
	} else {
		if (typeof a != "string") {
			try {
				a = a.toString()
			} catch (c) {
				a = ""
			}
		}
	}
	if (a.length) {
		this.propertyNameFilter_ = new RegExp("");
		this.propertyNameFilter_.compile(a)
	} else {
		this.propertyNameFilter_ = null
	}
	var d = this;

	function b(h, e) {
		h.__defineGetter__(e, function() {
			var n = this.getInternalObject();
			var k = n[e];
			var j = k;
			var p = d.watcherTable_[e];
			if (p) {
				var r = p.concat();
				for (var o = 0, m = r.length; o < m; ++o) {
					var s = r[o];
					if (!s) {
						window.console.log("wrapper's watch for " + e + " is unavailable!");
						continue
					}
					k = j;
					try {
						j = s(j, j, "get")
					} catch (q) {
						j = k
					}
				}
			}
			return j
		});
		h.__defineSetter__(e, function(s) {
			var m = this.getInternalObject();
			var t = s;
			var o = t;
			var j;
			try {
				j = m[e]
			} catch (q) {
				j = null
			}
			var p = d.watcherTable_[e];
			if (p) {
				var r = p.concat();
				for (var n = 0, k = r.length; n < k; ++n) {
					var u = r[n];
					if (!u) {
						window.console.log("wrapper's watch for " + e + " is unavailable!");
						continue
					}
					t = o;
					try {
						o = u(j, o, "set")
					} catch (q) {
						o = t
					}
				}
			}
			m[e] = o
		})
	}
	this.cleanUp_ = function() {
		d.window_.removeEventListener("unload", d.cleanUp_, false);
		for (var h = 0, e = d.properties_.length; h < e; ++h) {
			delete d.wrapper_[d.properties_[h]]
		}
		d.window_ = null;
		d.wrapper_ = null;
		d.properties_ = null;
		d.watcherTable_ = null;
		d.propertyNameFilter_ = null;
		d = null
	};
	for (var f in g) {
		if (this.propertyNameFilter_ && this.propertyNameFilter_.test(f)) {
			this.propertyNameFilter_.test("");
			continue
		}
		if (typeof g[f] != "function") {
			this.properties_.push(f);
			b(this.wrapper_, f)
		}
	}
	this.window_.addEventListener("unload", this.cleanUp_, false)
};
__screenCapturePageContext__.ObjectWrapDelegate.prototype.getWrapper = function() {
	return this.wrapper_
};
__screenCapturePageContext__.ObjectWrapDelegate.prototype.hasProperty = function(b) {
	for (var c = 0, a = this.properties_.length; c < a; ++c) {
		if (b == this.properties_[c]) {
			return true
		}
	}
	return false
};
__screenCapturePageContext__.ObjectWrapDelegate.prototype.watch = function(c, a) {
	if (!this.hasProperty(c)) {
		return false
	}
	var e = this.watcherTable_[c];
	if (e) {
		for (var d = 0, b = e.length; d < b; ++d) {
			if (a == e[d]) {
				return true
			}
		}
	} else {
		e = new Array();
		this.watcherTable_[c] = e
	}
	e.push(a);
	return true
};
__screenCapturePageContext__.ObjectWrapDelegate.prototype.unwatch = function(c, a) {
	if (!this.hasProperty(c)) {
		return false
	}
	var e = this.watcherTable_[c];
	if (e) {
		for (var d = 0, b = e.length; d < b; ++d) {
			if (a == e[d]) {
				e.splice(d, 1);
				return true
			}
		}
	}
	return false
};
__screenCapturePageContext__.init();