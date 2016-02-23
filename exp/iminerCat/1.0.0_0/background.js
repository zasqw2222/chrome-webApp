var DEBUG = false;
chrome.commands.onCommand.addListener(function(command) {
        alert(1)
});



var plugin = {
	pluginObj: document.getElementById("pluginObj"),
	autoSave: function(a, c, b) {
		return this.pluginObj.AutoSave(a, c, b)
	},
	openSavePath: function(a) {
		this.pluginObj.OpenSavePath(a)
	},
	getDefaultSavePath: function() {
		return this.pluginObj.GetDefaultSavePath()
	},
	saveToClipboard: function(a) {
		return this.pluginObj.SaveToClipboard(a)
	},
	captureScreen: function() {
		this.pluginObj.CaptureScreen()
	},
	setMessage: function() {
		var a = chrome.i18n.getMessage("ok");
		var b = chrome.i18n.getMessage("cancel");
		var c = chrome.i18n.getMessage("capture_tip");
		if (this.pluginObj.SetMessage) {
			this.pluginObj.SetMessage(a, b, c)
		}
	},
	setHotKey: function(a) {
		return this.pluginObj.SetHotKey(a)
	},
	disableScreenCaptureHotKey: function() {
		return this.pluginObj.DisableHotKey()
	},
	getViewPortWidth: function() {
		try {
			return this.pluginObj.GetViewPortWidth()
		} catch (a) {
			return null
		}
	}
};
var screenshot = {
	tab: 0,
	canvas: document.createElement("canvas"),
	startX: 0,
	startY: 0,
	scrollX: 0,
	scrollY: 0,
	docHeight: 0,
	docWidth: 0,
	visibleWidth: 0,
	visibleHeight: 0,
	scrollXCount: 0,
	scrollYCount: 0,
	scrollBarX: 17,
	scrollBarY: 17,
	captureStatus: true,
	handleHotKey: function(a) {
		if (HotKey.isEnabled()) {
			switch (a) {
				case HotKey.getCharCode("area"):
					screenshot.showSelectionArea();
					break;
				case HotKey.getCharCode("viewport"):
					screenshot.captureWindow();
					break;
				case HotKey.getCharCode("fullpage"):
					screenshot.captureWebpage();
					break;
				case HotKey.getCharCode("screen"):
					screenshot.captureScreen();
					break
			}
		}
	},
	addMessageListener: function() {
		chrome.runtime.onMessage.addListener(function(d, c, a) {
			var e = d;
			var b = HotKey.isEnabled();
			switch (e.msg) {
				case "capture_hot_key":
					screenshot.handleHotKey(e.keyCode);
					break;
				case "gtools_scp_capture_selected":
					screenshot.captureSelected();
					break;
				case "capture_window":
					if (b) {
						screenshot.captureWindow()
					}
					break;
				case "gtools_scp_capture_area":
					if (b) {
						screenshot.showSelectionArea()
					}
					break;
				case "capture_webpage":
					if (b) {
						screenshot.captureWebpage()
					}
					break;
				case "original_view_port_width":
					a(null);
					break
			}
			if (d.what == "_trackEvent") {
				trackEvent(e.category, e.action, e.label)
			}
		})
	},
	sendMessage: function(a, b) {
		chrome.tabs.getSelected(null, function(c) {
			chrome.tabs.sendMessage(c.id, a, b)
		})
	},
	showSelectionArea: function() {
		screenshot.sendMessage({
			msg: "gtools_scp_show_selection_area"
		}, null)
	},
	captureScreen: function() {},
	captureWindow: function() {
		screenshot.sendMessage({
			msg: "capture_window"
		}, screenshot.onResponseVisibleSize)
	},
	captureSelected: function() {
		screenshot.sendMessage({
			msg: "gtools_scp_capture_selected"
		}, screenshot.onResponseVisibleSize)
	},
	captureWebpage: function() {
		screenshot.sendMessage({
			msg: "scroll_init"
		}, screenshot.onResponseVisibleSize)
	},
	onResponseVisibleSize: function(a) {
		switch (a.msg) {
			case "capture_window":
				setTimeout(screenshot.captureVisible, 100, a.docWidth, a.docHeight);
				break;
			case "gtools_scp_scroll_init_done":
				screenshot.startX = a.startX, screenshot.startY = a.startY, screenshot.scrollX = a.scrollX, screenshot.scrollY = a.scrollY, screenshot.canvas.width = a.canvasWidth;
				screenshot.canvas.height = a.canvasHeight;
				screenshot.visibleHeight = a.visibleHeight, screenshot.visibleWidth = a.visibleWidth, screenshot.scrollXCount = a.scrollXCount;
				screenshot.scrollYCount = a.scrollYCount;
				screenshot.docWidth = a.docWidth;
				screenshot.docHeight = a.docHeight;
				screenshot.zoom = a.zoom;
				setTimeout("screenshot.captureAndScroll()", 100);
				break;
			case "gtools_scp_scroll_next_done":
				screenshot.scrollXCount = a.scrollXCount;
				screenshot.scrollYCount = a.scrollYCount;
				setTimeout("screenshot.captureAndScroll()", 100);
				break;
			case "gtools_scp_scroll_finished":
				screenshot.captureAndScrollDone();
				break
		}
	},
	captureSpecialPage: function() {
		var a = localStorage.screenshootQuality || "png";
		chrome.tabs.captureVisibleTab(null, {
			format: a,
			quality: 50
		}, function(b) {
			var c = new Image();
			c.onload = function() {
				screenshot.canvas.width = c.width;
				screenshot.canvas.height = c.height;
				var d = screenshot.canvas.getContext("2d");
				d.drawImage(c, 0, 0);
				screenshot.postImage()
			};
			c.src = b
		})
	},
	captureScreenCallback: function(a) {
		var b = new Image();
		b.onload = function() {
			screenshot.canvas.width = b.width;
			screenshot.canvas.height = b.height;
			var c = screenshot.canvas.getContext("2d");
			c.drawImage(b, 0, 0);
			screenshot.postImage()
		};
		b.src = "data:image/bmp;base64," + a
	},
	capturePortion: function(f, e, a, h, c, b, d, i) {
		var g = localStorage.screenshootQuality || "png";
		chrome.tabs.captureVisibleTab(null, {
			format: g,
			quality: 50
		}, function(j) {
			var k = new Image();
			k.onload = function() {
				var p = k.width < d ? k.height - screenshot.scrollBarY : k.height;
				var n = k.height < i ? k.width - screenshot.scrollBarX : k.width;
				var o = n / c;
				var m = p / b;
				screenshot.canvas.width = a * o;
				screenshot.canvas.height = h * m;
				var l = screenshot.canvas.getContext("2d");
				l.drawImage(k, f * o, e * m, a * o, h * m, 0, 0, a * o, h * m);
				screenshot.postImage()
			};
			k.src = j
		})
	},
	captureVisible: function(c, b) {
		var a = "jpeg";
		chrome.tabs.captureVisibleTab(null, {
			format: a,
			quality: 100
		}, function(d) {
			var e = new Image();
			e.onload = function() {
				var h = e.width;
				var f = e.height;
				screenshot.canvas.width = h;
				screenshot.canvas.height = f;
				var g = screenshot.canvas.getContext("2d");
				if (DEBUG) {
					console.log("width=" + h + " height=" + f + " image.width=" + e.width + " image.height=" + e.height)
				}
				g.drawImage(e, 0, 0, e.width, e.height, 0, 0, h, f);
				screenshot.postImage()
			};
			e.src = d
		})
	},
	captureAndScroll: function() {
		var a = "jpeg";
		chrome.tabs.captureVisibleTab(null, {
			format: a,
			quality: 100
		}, function(b) {
			var c = new Image();
			c.onload = function() {
				var f = screenshot.canvas.getContext("2d");
				var e = 0;
				var m = 0;
				var i = (screenshot.visibleWidth < screenshot.canvas.width ? screenshot.visibleWidth : screenshot.canvas.width);
				var h = (screenshot.visibleHeight < screenshot.canvas.height ? screenshot.visibleHeight : screenshot.canvas.height);
				var n = screenshot.zoom;
				var g = screenshot.startX - Math.round(screenshot.scrollX * n);
				var d = 0;
				var l = screenshot.startY - Math.round(screenshot.scrollY * n);
				var k = 0;
				if ((screenshot.scrollYCount + 1) * i > screenshot.canvas.width) {
					e = screenshot.canvas.width % i;
					g = (screenshot.scrollYCount + 1) * i - screenshot.startX - screenshot.docWidth
				} else {
					e = i
				}
				if ((screenshot.scrollXCount + 1) * h > screenshot.canvas.height) {
					m = screenshot.canvas.height % h;
					if ((screenshot.scrollXCount + 1) * h + screenshot.scrollY < screenshot.docHeight) {
						l = 0
					} else {
						l = (screenshot.scrollXCount + 1) * h + screenshot.scrollY - screenshot.docHeight
					}
				} else {
					m = h
				}
				d = screenshot.scrollYCount * i;
				k = screenshot.scrollXCount * h;
				var j = c.width / screenshot.docWidth;
				f.drawImage(c, parseInt(g * j), parseInt(l * j), parseInt(e * j), parseInt(m * j), d, k, e, m);
				screenshot.sendMessage({
					msg: "gtools_scp_scroll_next",
					visibleWidth: i,
					visibleHeight: h
				}, screenshot.onResponseVisibleSize)
			};
			c.src = b
		})
	},
	captureAndScrollDone: function() {
		screenshot.postImage()
	},
	postImage: function() {
		if (DEBUG) {
			console.log("in postImage start sendMessage gtools_scp_restore_scrollbar")
		}
		screenshot.sendMessage({
			msg: "gtools_scp_restore_scrollbar"
		}, null);
		if (eval(localStorage.autoSave)) {} else {
			chrome.tabs.getSelected(null, function(tab) {
				screenshot.tab = tab
			});
			chrome.tabs.create({
				url: "showimage.html"
			})
		}
		var popup = chrome.extension.getViews({
			type: "popup"
		})[0];
		if (popup) {
			popup.close()
		}
	},
	showNotification: function() {
		var a = webkitNotifications.createHTMLNotification("notification.html");
		a.show()
	},
	isThisPlatform: function(a) {
		return navigator.userAgent.toLowerCase().indexOf(a) > -1
	},
	executeScriptsInExistingTabs: function() {},
	init: function() {
		




		localStorage.screenshootQuality = localStorage.screenshootQuality || "png";
		screenshot.executeScriptsInExistingTabs();
		screenshot.addMessageListener()
	}
};

screenshot.init();
var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-51061974-1"]);
_gaq.push(["_trackPageview"]);
(function() {
	var b = document.createElement("script");
	b.type = "text/javascript";
	b.async = true;
	b.src = "https://ssl.google-analytics.com/ga.js";
	var a = document.getElementsByTagName("script")[0];
	a.parentNode.insertBefore(b, a)
})();

function trackEvent(b, c, a) {
	_gaq.push(["_trackEvent", b, c, a])
}
if (Math.random() < 0.1) {
	trackEvent("background", "version_stat", chrome.app.getDetails().version)
};