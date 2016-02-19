var shortcutKey = {
	init: function() {
		if (document.body.hasAttribute("gtools_scp_screen_capture_injected")) {
			return
		}
		document.body.setAttribute("gtools_scp_screen_capture_injected", true);
		document.body.addEventListener("keydown", shortcutKey.handleShortcut, false)
	},
	isThisPlatform: function(a) {
		return navigator.userAgent.toLowerCase().indexOf(a) > -1
	},
	handleShortcut: function(b) {
		var a = shortcutKey.isThisPlatform("mac");
		var c = b.keyCode;
		if ((b.ctrlKey && b.altKey && !a || b.metaKey && b.altKey && a) && c > 64 && c < 91) {
			shortcutKey.sendMessage({
				msg: "capture_hot_key",
				keyCode: c
			})
		}
	},
	sendMessage: function(a) {
		chrome.runtime.sendMessage(a)
	}
};
shortcutKey.init();