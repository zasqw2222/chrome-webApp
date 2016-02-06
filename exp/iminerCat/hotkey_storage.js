var HotKey = (function() {
	return {
		setup: function(b) {
			if (!localStorage.getItem("hot_key_enabled")) {
				localStorage.setItem("hot_key_enabled", true)
			}
			if (!this.get("area")) {
				this.set("area", "R")
			}
			if (!this.get("viewport")) {
				this.set("viewport", "V")
			}
			if (!this.get("fullpage")) {
				this.set("fullpage", "H")
			}
			if (!this.get("screen")) {
				this.set("screen", "P")
			}
			var a = this.get("screen");
			if (this.isEnabled() && !b.setHotKey(a.charCodeAt(0))) {
				this.set("screen", "@")
			}
		},
		set: function(b, c) {
			var a = b + "_capture_hot_key";
			localStorage.setItem(a, c)
		},
		get: function(a) {
			return localStorage.getItem(a + "_capture_hot_key")
		},
		getCharCode: function(a) {
			return this.get(a).charCodeAt(0)
		},
		enable: function() {
			localStorage.setItem("hot_key_enabled", true)
		},
		disable: function(a) {
			localStorage.setItem("hot_key_enabled", false);
			a.plugin.disableScreenCaptureHotKey()
		},
		isEnabled: function() {
			return localStorage.getItem("hot_key_enabled") == "true"
		}
	}
})();