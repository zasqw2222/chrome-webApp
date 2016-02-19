function isHighVersion() {
	var a = navigator.userAgent.match(/Chrome\/(\d+)/)[1];
	return a > 9
}
function $(a) {
	return document.getElementById(a)
}
function i18nReplace(b, a) {
	return $(b).innerHTML = chrome.i18n.getMessage(a)
}
var bg = chrome.extension.getBackgroundPage();
var canvas = new Canvas();
var photoshop = {
	canvas: document.createElement("canvas"),
	tabTitle: "",
	startX: 0,
	startY: 0,
	endX: 0,
	endY: 0,
	dragFlag: false,
	flag: "rectangle",
	layerId: "layer0",
	canvasId: "",
	color: "#ff0000",
	highlightColor: "",
	lastValidAction: 0,
	markedArea: [],
	isDraw: true,
	offsetX: 0,
	offsetY: 36,
	nowHeight: 0,
	nowWidth: 0,
	highlightType: "border",
	highlightMode: "rectangle",
	text: "",
	i18nReplace: i18nReplace,
	initCanvas: function() {
		$("canvas").width = $("mask-canvas").width = $("photo").style.width = photoshop.canvas.width = bg.screenshot.canvas.width;
		$("canvas").height = $("mask-canvas").height = $("photo").style.height = photoshop.canvas.height = bg.screenshot.canvas.height;
		var a = photoshop.canvas.getContext("2d");
		a.drawImage(bg.screenshot.canvas, 0, 0);
		a = $("canvas").getContext("2d");
		a.drawImage(photoshop.canvas, 0, 0);
		$("canvas").style.display = "block"
	},
	init: function() {
		var b = bg.screenshot.isThisPlatform("mac");
		if (b) {
			$("btnCopy").style.display = "none"
		}
		photoshop.initTools();
		photoshop.initCanvas();
		photoshop.tabTitle = bg.screenshot.tab.title;
		var a = function() {
				$("showBox").style.height = window.innerHeight - photoshop.offsetY - 1
			};
		setTimeout(a, 50)
	},
	markCurrentElement: function(c) {
		if (c && c.parentNode) {
			var b = c.parentNode.children;
			for (var a = 0; a < b.length; a++) {
				var d = b[a];
				if (d == c) {
					c.className = "mark"
				} else {
					d.className = ""
				}
			}
		}
	},
	setHighLightMode: function() {
		photoshop.highlightType = localStorage.highlightType || "border";
		photoshop.color = localStorage.highlightColor || "#FF0000";
		$(photoshop.layerId).style.border = "7px solid " + photoshop.color;///////
		if (photoshop.highlightType == "rect") {
			$(photoshop.layerId).style.backgroundColor = photoshop.color;
			$(photoshop.layerId).style.opacity = 0.5
		}
		if (photoshop.flag == "rectangle") {
			$(photoshop.layerId).style.borderRadius = "0 0"
		} else {
			if (photoshop.flag == "radiusRectangle") {
				$(photoshop.layerId).style.borderRadius = "6px 6px"
			} else {
				if (photoshop.flag == "ellipse") {
					$(photoshop.layerId).style.border = "0";
					$(photoshop.layerId).style.backgroundColor = "";
					$(photoshop.layerId).style.opacity = 1
				}
			}
		}
	},
	setBlackoutMode: function() {
		photoshop.color = "#000000";
		$(photoshop.layerId).style.opacity = 1;
		$(photoshop.layerId).style.backgroundColor = "#000000";
		$(photoshop.layerId).style.border = "2px solid #000000"
	},
	setTextMode: function() {
		localStorage.fontSize = localStorage.fontSize || "16";
		photoshop.color = localStorage.fontColor = localStorage.fontColor || "#FF0000";
		$(photoshop.layerId).setAttribute("contentEditable", true);
		$(photoshop.layerId).style.border = "1px dotted #333333";
		$(photoshop.layerId).style.cursor = "text";
		$(photoshop.layerId).style.lineHeight = localStorage.fontSize + "px";
		$(photoshop.layerId).style.fontSize = localStorage.fontSize + "px";
		$(photoshop.layerId).style.color = photoshop.color;
		$(photoshop.layerId).innerHTML = "<br/>";
		var a = $(photoshop.layerId);
		var b = photoshop.layerId;
		a.addEventListener("blur", function() {
			photoshop.setTextToArray(b)
		}, true);
		a.addEventListener("click", function() {
			this.style.border = "1px dotted #333333"
		}, true);
		a.addEventListener("mouseout", function() {
			if (!photoshop.dragFlag) {
				this.style.borderWidth = 0
			}
		}, false);
		a.addEventListener("mousemove", function() {
			this.style.border = "1px dotted #333333"
		}, false)
	},
	setTextToArray: function(c) {
		var b = $(c).innerText.split("\n");
		if (photoshop.markedArea.length > 0) {
			for (var a = photoshop.markedArea.length - 1; a >= 0; a--) {
				if (photoshop.markedArea[a].id == c) {
					photoshop.markedArea[a].context = b;
					break
				}
			}
			$(c).style.borderWidth = 0
		}
	},
	openOptionPage: function() {
		chrome.tabs.create({
			url: chrome.extension.getURL("options.html")
		})
	},
	closeCurrentTab: function() {
		chrome.tabs.getSelected(null, function(a) {
			chrome.tabs.remove(a.id)
		})
	},
	finish: function() {
		var a = $("canvas").getContext("2d");
		a.drawImage(photoshop.canvas, 0, 0)
	},
	colorRgba: function(b, c) {
		var e = b.toLowerCase();
		var a = [];
		for (var d = 1; d < e.length; d += 2) {
			a.push(parseInt("0x" + e.slice(d, d + 2)))
		}
		return "rgba(" + a.join(",") + "," + c + ")"
	},
	toDo: function(a, b) {
		photoshop.flag = b;
		photoshop.isDraw = true;
		photoshop.markCurrentElement(a)
	},
	setDivStyle: function(a, b) {
		$(photoshop.layerId).setAttribute("style", "");
		$(photoshop.layerId).setAttribute("contentEditable", false);
		switch (photoshop.flag) {
		case "rectangle":
		case "radiusRectangle":
		case "ellipse":
			photoshop.setHighLightMode();
			break;
		case "redact":
			photoshop.setBlackoutMode();
			break;
		case "text":
			photoshop.setTextMode();
			break;
		case "line":
		case "arrow":
			photoshop.drawLineOnMaskCanvas(a, b, a, b, "lineStart", photoshop.layerId);
			break;
		case "blur":
			photoshop.createCanvas(photoshop.layerId);
			break
		}
	},
	createDiv: function() {
		photoshop.lastValidAction++;
		photoshop.layerId = "layer" + photoshop.lastValidAction;
		if ($(photoshop.layerId)) {
			photoshop.removeElement(photoshop.layerId)
		}
		var a = document.createElement("div");
		a.id = photoshop.layerId;
		a.className = "layer";
		$("photo").appendChild(a);
		if (photoshop.flag == "blur") {
			photoshop.createCanvas(photoshop.layerId)
		}
		return a
	},
	createCanvas: function(b) {
		photoshop.canvasId = "cav-" + b;
		if (!$(photoshop.canvasId)) {
			var a = document.createElement("canvas");
			a.id = photoshop.canvasId;
			a.width = 10;
			a.height = 10;
			$(photoshop.layerId).appendChild(a);
			return a
		}
		return $(photoshop.canvasId)
	},
	createCloseButton: function(b, g, e, d, a) {
		var c = document.createElement("img");
		c.id = g;
		c.src = "images/cross.png";
		c.className = "closeButton";
		c.style.left = e - 15 + "px";
		if (photoshop.flag == "line" || photoshop.flag == "arrow") {
			c.style.left = e / 2 - 5 + "px";
			c.style.top = d / 2 - 5 + "px"
		}
		c.onclick = function() {
			$(b).style.display = "none";
			photoshop.removeLayer(b)
		};
		$(b).onmousemove = function() {
			if (!photoshop.dragFlag) {
				photoshop.showCloseButton(g);
				$(b).style.zIndex = 110;
				photoshop.isDraw = (a == "text" ? false : photoshop.isDraw)
			}
		};
		$(b).onmouseout = function() {
			photoshop.hideCloseButton(g);
			$(b).style.zIndex = 100;
			photoshop.isDraw = true
		};
		$(b).appendChild(c);
		return c
	},
	showCloseButton: function(a) {
		$(a).style.display = "block"
	},
	hideCloseButton: function(a) {
		$(a).style.display = "none";
		photoshop.isDraw = true
	},
	removeLayer: function(b) {
		for (var a = 0; a < photoshop.markedArea.length; a++) {
			if (photoshop.markedArea[a].id == b) {
				photoshop.markedArea.splice(a, 1);
				break
			}
		}
		photoshop.removeElement(b)
	},
	onMouseDown: function(a) {
		if (photoshop.isDraw && a.button != 2) {
			photoshop.startX = a.pageX + $("showBox").scrollLeft - photoshop.offsetX;
			photoshop.startY = a.pageY + $("showBox").scrollTop - photoshop.offsetY;
			photoshop.setDivStyle(photoshop.startX, photoshop.startY);
			photoshop.dragFlag = true;
			$(photoshop.layerId).style.left = photoshop.startX + "px";
			$(photoshop.layerId).style.top = photoshop.startY + "px";
			$(photoshop.layerId).style.height = 0;
			$(photoshop.layerId).style.width = 0;
			$(photoshop.layerId).style.display = "block"
		}
	},
	onMouseUp: function(a) {
		$("mask-canvas").style.zIndex = 10;
		photoshop.endX = a.pageX + $("showBox").scrollLeft - photoshop.offsetX;
		if (photoshop.endX > photoshop.canvas.width) {
			photoshop.endX = photoshop.canvas.width
		}
		if (photoshop.endX < 0) {
			photoshop.endX = 0
		}
		photoshop.endY = a.pageY + $("showBox").scrollTop - photoshop.offsetY;
		if (photoshop.endY > photoshop.canvas.height) {
			photoshop.endY = photoshop.canvas.height
		}
		if (photoshop.endY < 0) {
			photoshop.endY = 0
		}
		if (photoshop.isDraw && photoshop.dragFlag && (photoshop.endX != photoshop.startX || photoshop.endY != photoshop.startY)) {
			if (photoshop.flag == "line" || photoshop.flag == "arrow") {
				photoshop.drawLineOnMaskCanvas(photoshop.startX, photoshop.startY, photoshop.endX, photoshop.endY, "drawEnd", photoshop.layerId)
			} else {
				if (photoshop.flag == "blur") {
					canvas.blurImage(photoshop.canvas, $(photoshop.canvasId), photoshop.layerId, photoshop.startX, photoshop.startY, photoshop.endX, photoshop.endY)
				} else {
					if (photoshop.flag == "ellipse") {
						photoshop.drawEllipseOnMaskCanvas(photoshop.endX, photoshop.endY, "end", photoshop.layerId)
					}
				}
			}
			photoshop.markedArea.push({
				id: photoshop.layerId,
				startX: photoshop.startX,
				startY: photoshop.startY,
				endX: photoshop.endX,
				endY: photoshop.endY,
				width: photoshop.nowWidth,
				height: photoshop.nowHeight,
				flag: photoshop.flag,
				highlightType: photoshop.highlightType,
				fontSize: localStorage.fontSize,
				color: photoshop.color,
				context: ""
			});
			$(photoshop.layerId).focus();
			var b = "close_" + photoshop.layerId;
			photoshop.createCloseButton(photoshop.layerId, b, photoshop.nowWidth, photoshop.nowHeight, photoshop.flag);
			photoshop.createDiv()
		} else {
			if (photoshop.endX == photoshop.startX && photoshop.endY == photoshop.startY) {
				photoshop.removeElement(photoshop.layerId);
				photoshop.createDiv()
			}
		}
		photoshop.dragFlag = false
	},
	onMouseMove: function(a) {
		if (photoshop.dragFlag) {
			$("mask-canvas").style.zIndex = 200;
			photoshop.endX = a.pageX + $("showBox").scrollLeft - photoshop.offsetX;
			if (photoshop.endX > photoshop.canvas.width) {
				photoshop.endX = photoshop.canvas.width
			}
			if (photoshop.endX < 0) {
				photoshop.endX = 0
			}
			photoshop.endY = a.pageY + $("showBox").scrollTop - photoshop.offsetY;
			if (photoshop.endY > photoshop.canvas.height) {
				photoshop.endY = photoshop.canvas.height
			}
			if (photoshop.endY < 0) {
				photoshop.endY = 0
			}
			photoshop.nowHeight = photoshop.endY - photoshop.startY - 1;
			photoshop.nowWidth = photoshop.endX - photoshop.startX - 1;
			if (photoshop.nowHeight < 0) {
				$(photoshop.layerId).style.top = photoshop.endY + "px";
				photoshop.nowHeight = -1 * photoshop.nowHeight
			}
			if (photoshop.nowWidth < 0) {
				$(photoshop.layerId).style.left = photoshop.endX + "px";
				photoshop.nowWidth = -1 * photoshop.nowWidth
			}
			$(photoshop.layerId).style.height = photoshop.nowHeight - 3;
			$(photoshop.layerId).style.width = photoshop.nowWidth - 3;
			if (photoshop.flag == "line" || photoshop.flag == "arrow") {
				photoshop.drawLineOnMaskCanvas(photoshop.startX, photoshop.startY, photoshop.endX, photoshop.endY, "lineDrawing", photoshop.layerId)
			} else {
				if (photoshop.flag == "blur") {
					$(photoshop.layerId).style.height = photoshop.nowHeight;
					$(photoshop.layerId).style.width = photoshop.nowWidth;
					canvas.blurImage(photoshop.canvas, $(photoshop.canvasId), photoshop.layerId, photoshop.startX, photoshop.startY, photoshop.endX, photoshop.endY)
				} else {
					if (photoshop.flag == "ellipse") {
						photoshop.drawEllipseOnMaskCanvas(photoshop.endX, photoshop.endY, "drawing", photoshop.layerId)
					}
				}
			}
		}
	},
	removeElement: function(a) {
		if ($(a)) {
			$(a).parentNode.removeChild($(a))
		}
	},
	draw: function() {
		var d = $("canvas").getContext("2d");
        d.lineWidth = 3;
		for (var k = 0; k < photoshop.markedArea.length; k++) {
			var g = photoshop.markedArea[k];
			var n = (g.startX < g.endX) ? g.startX : g.endX;
			var m = (g.startY < g.endY) ? g.startY : g.endY;
			var c = g.width;
			var o = g.height;
			var h = g.color;
			switch (g.flag) {
			case "rectangle":
				if (g.highlightType == "border") {
					canvas.drawStrokeRect(d, h, n, m, c, o, 10)
				} else {
					var h = changeColorToRgba(h, 0.5);
					canvas.drawFillRect(d, h, n, m, c, o)
				}
				break;
			case "radiusRectangle"://圆角矩形
				canvas.drawRoundedRect(d, h, n, m, c, o, 6, g.highlightType);
				break;
			case "ellipse":
				n = (g.startX + g.endX) / 2;
				m = (g.startY + g.endY) / 2;
				var e = Math.abs(g.endX - g.startX) / 2;
				var b = Math.abs(g.endY - g.startY) / 2;
				canvas.drawEllipse(d, h, n, m, e, b, 3, g.highlightType);
				break;
			case "redact":
				canvas.drawFillRect(d, h, n, m, c, o);
				break;
			case "text":
				for (var l = 0; l < g.context.length; l++) {
					canvas.setText(d, g.context[l], h, g.fontSize, "arial", g.fontSize, n, m + g.fontSize * l, c)
				}
				break;
			case "blur":
				var a = d.getImageData(n, m, photoshop.markedArea[k].width, photoshop.markedArea[k].height);
				a = canvas.boxBlur(a, photoshop.markedArea[k].width, photoshop.markedArea[k].height, 10);
				d.putImageData(a, n, m, 0, 0, photoshop.markedArea[k].width, photoshop.markedArea[k].height);
				break;
			case "line":
				canvas.drawLine(d, h, "round", 2, g.startX, g.startY, g.endX, g.endY);
				break;
			case "arrow":
				canvas.drawArrow(d, h, 2, 4, 10, "round", g.startX, g.startY, g.endX, g.endY);
				break
			}
		}
	},
	save: function() {
		photoshop.draw();
		var b = "jpeg";
		var d;
		var a = 0.8;
		var c = bg.screenshot.isThisPlatform("mac");
		if (c) {
			a = 0.12 * 2500 * 9600 / (bg.screenshot.canvas.width * bg.screenshot.canvas.height);
			if (a > 1) {
				a = 0.8
			}
		} else {
			a = 0.84 * 1280 * 4800 / (bg.screenshot.canvas.width * bg.screenshot.canvas.height);
			if (a > 1) {
				a = 1
			}
		}
		if (bg.screenshot.canvas.width * bg.screenshot.canvas.height < 1280 * 700) {
			a = 1
		}
		d = $("canvas").toDataURL("image/jpeg", a);
		$("saveImageLink").href = d.replace(/^data:image\/[^;]/, "data:application/octet-stream");
		$("saveImageLink").download = photoshop.tabTitle + ".png";
		$("saveImageLink").click();
		photoshop.finish()
	},
	copy: function() {
		photoshop.draw();
		var b = localStorage.screenshootQuality || "png";
		var e;
		if (b == "jpeg" && isHighVersion()) {
			e = $("canvas").toDataURL("image/jpeg", 0.5)
		} else {
			e = $("canvas").toDataURL("image/png")
		}
		var g = bg.plugin.saveToClipboard(e);
		var c = "tip_copy_failed";
		var a = "tip_failed";
		if (g) {
			c = "tip_copy_succeed";
			a = "tip_succeed"
		}
		var d = chrome.i18n.getMessage(c);
		photoshop.showTip(a, d);
		photoshop.finish()
	},
	printImage: function() {
		photoshop.draw();
		var b = localStorage.screenshootQuality || "png";
		var e;
		if (b == "jpeg" && isHighVersion()) {
			e = $("canvas").toDataURL("image/jpeg", 0.5)
		} else {
			e = $("canvas").toDataURL("image/png")
		}
		var d = $("canvas").width;
		var a = $("canvas").height;
		var c = document.getElementById("pluginobj");
		c.PrintImage(e, photoshop.tabTitle, d, a);
		photoshop.finish()
	},
	drawLineOnMaskCanvas: function(h, g, m, l, j, e) {
		var n = $("mask-canvas").getContext("2d");
		n.clearRect(0, 0, $("mask-canvas").width, $("mask-canvas").height);
		if (j == "drawEnd") {
			var d = 20;
			var a = Math.abs(m - photoshop.startX) > 0 ? Math.abs(m - photoshop.startX) : 0;
			var k = Math.abs(l - photoshop.startY) > 0 ? Math.abs(l - photoshop.startY) : 0;
			var c = parseInt($(e).style.left);
			var b = parseInt($(e).style.top);
			h = h - c + d / 2;
			g = g - b + d / 2;
			m = m - c + d / 2;
			l = l - b + d / 2;
			$(e).style.left = c - d / 2;
			$(e).style.top = b - d / 2;
			var i = photoshop.createCanvas(e);
			i.width = a + d;
			i.height = k + d;
			n = i.getContext("2d")
		}
		if (localStorage.lineType == "line") {
			canvas.drawLine(n, localStorage.lineColor, "round", 2, h, g, m, l)
		} else {
			canvas.drawArrow(n, localStorage.lineColor, 2, 4, 10, "round", h, g, m, l)
		}
	},
	createColorPadStr: function(g, h) {
		var e = ["#000000", "#0036ff", "#008000", "#dacb23", "#d56400", "#c70000", "#be00b3", "#1e2188", "#0090ff", "#22cc01", "#ffff00", "#ff9600", "#ff0000", "#ff008e", "#7072c3", "#49d2ff", "#9dff3d", "#ffffff", "#ffbb59", "#ff6b6b", "#ff6bbd"];
		var j = document.createElement("div");
		j.id = "colorpad";
		g.appendChild(j);
		for (var d = 0; d < e.length; d++) {
			var b = document.createElement("a");
			var c = e[d];
			b.id = c;
			b.title = c;
			b.style.backgroundColor = c;
			if (c == "#ffffff") {
				b.style.border = "1px solid #444";
				b.style.width = "12px";
				b.style.height = "12px"
			}
			b.addEventListener("click", function(a) {
				photoshop.colorPadPick(a.target.id, h);
				return false
			});
			j.appendChild(b)
		}
	},
	colorPadPick: function(a, b) {
		photoshop.color = a;
		if (b == "highlight") {
			localStorage.highlightColor = a;
			photoshop.setHighlightColorBoxStyle(a)
		} else {
			if (b == "text") {
				localStorage.fontColor = a;
				$("fontColorBox").style.backgroundColor = a
			} else {
				if (b == "line") {
					localStorage.lineColor = a;
					photoshop.setLineColorBoxStyle()
				} else {
					if (b == "ellipse") {
						$("ellipseBox").style.borderColor = a
					}
				}
			}
		}
	},
	setHighlightColorBoxStyle: function(a) {
		var b = $("highlightColorBox");
		b.style.borderColor = a;
		localStorage.highlightType = localStorage.highlightType || "border";
		if (localStorage.highlightType == "border") {
			b.style.background = "#ffffff";
			b.style.opacity = 1;
			$("borderMode").className = "mark";
			$("rectMode").className = ""
		} else {
			if (localStorage.highlightType == "rect") {
				b.style.background = a;
				b.style.opacity = 0.5;
				$("borderMode").className = "";
				$("rectMode").className = "mark"
			}
		}
		if (photoshop.flag == "rectangle") {
			b.style.borderRadius = "0 0"
		} else {
			if (photoshop.flag == "radiusRectangle") {
				b.style.borderRadius = "3px 3px"
			} else {
				if (photoshop.flag == "ellipse") {
					b.style.borderRadius = "12px 12px"
				}
			}
		}
		photoshop.markCurrentElement($(photoshop.flag))
	},
	setBlackoutColorBoxStyle: function() {
		localStorage.blackoutType = localStorage.blackoutType || "redact";
		if (localStorage.blackoutType == "redact") {
			$("blackoutBox").className = "rectBox";
			$("redact").className = "mark";
			$("blur").className = ""
		} else {
			if (localStorage.blackoutType == "blur") {
				$("blackoutBox").className = "blurBox";
				$("redact").className = "";
				$("blur").className = "mark"
			}
		}
	},
	setFontSize: function(a) {
		var b = "size_" + a;
		localStorage.fontSize = a;
		$("size_10").className = "";
		$("size_16").className = "";
		$("size_18").className = "";
		$("size_32").className = "";
		$(b).className = "mark"
	},
	setLineColorBoxStyle: function() {
		localStorage.lineType = localStorage.lineType || "line";
		photoshop.color = localStorage.lineColor = localStorage.lineColor || "#FF0000";
		var a = $("lineIconCav").getContext("2d");
		a.clearRect(0, 0, 14, 14);
		if (localStorage.lineType == "line") {
			$("straightLine").className = "mark";
			$("arrow").className = "";
			canvas.drawLine(a, photoshop.color, "round", 2, 1, 13, 13, 1)
		} else {
			if (localStorage.lineType == "arrow") {
				$("straightLine").className = "";
				$("arrow").className = "mark";
				canvas.drawArrow(a, photoshop.color, 2, 4, 7, "round", 1, 13, 13, 1)
			}
		}
	},
	initTools: function() {
		photoshop.i18nReplace("tHighlight", "highlight");
		photoshop.i18nReplace("tRedact", "redact");
		photoshop.i18nReplace("redactText", "solid_black");
		photoshop.i18nReplace("tText", "text");
		photoshop.i18nReplace("tCopy", "copy");
		photoshop.i18nReplace("tSave", "save");
		photoshop.i18nReplace("tUpload", "share");
		photoshop.i18nReplace("tPrint", "print");
		photoshop.i18nReplace("tClose", "close");
		photoshop.i18nReplace("border", "border");
		photoshop.i18nReplace("rect", "rect");
		photoshop.i18nReplace("blurText", "blur");
		photoshop.i18nReplace("lineText", "line");
		photoshop.i18nReplace("size_10", "size_small");
		photoshop.i18nReplace("size_16", "size_normal");
		photoshop.i18nReplace("size_18", "size_large");
		photoshop.i18nReplace("size_32", "size_huge");
		var a = localStorage.fontSize = localStorage.fontSize || 16;
		if (a != 10 && a != 16 && a != 18 && a != 32) {
			localStorage.fontSize = 16
		}
		localStorage.highlightMode = photoshop.flag = localStorage.highlightMode || "rectangle";
		localStorage.highlightColor = localStorage.highlightColor || "#FF0000";
		localStorage.fontColor = localStorage.fontColor || "#FF0000";
		localStorage.highlightType = photoshop.highlightType = localStorage.highlightType || "border";
		localStorage.blackoutType = localStorage.blackoutType || "redact";
		localStorage.lineType = localStorage.lineType || "line";
		localStorage.lineColor = localStorage.lineColor || "#FF0000";
		photoshop.setHighlightColorBoxStyle(localStorage.highlightColor);
		$("fontColorBox").style.backgroundColor = localStorage.fontColor || "#FF0000";
		$("btnHighlight").addEventListener("click", function() {
			photoshop.toDo(this, localStorage.highlightMode);
			photoshop.setHighlightColorBoxStyle(localStorage.highlightColor)
		}, false);
		$("btnBlackout").addEventListener("click", function() {
			photoshop.toDo(this, localStorage.blackoutType);
			photoshop.setBlackoutColorBoxStyle()
		}, false);
		$("btnText").addEventListener("click", function() {
			photoshop.toDo(this, "text")
		}, false);
		$("btnLine").addEventListener("click", function() {
			photoshop.toDo(this, localStorage.lineType);
			photoshop.setLineColorBoxStyle()
		}, false);
		photoshop.setHighlightColorBoxStyle(localStorage.highlightColor);
		$("borderMode").addEventListener("click", function() {
			localStorage.highlightType = "border"
		}, false);
		$("rectMode").addEventListener("click", function() {
			localStorage.highlightType = "rect"
		}, false);
		$("rectangle").addEventListener("click", function() {
			localStorage.highlightMode = photoshop.flag = "rectangle";
			photoshop.markCurrentElement(this)
		}, false);
		$("radiusRectangle").addEventListener("click", function() {
			localStorage.highlightMode = photoshop.flag = "radiusRectangle";
			photoshop.markCurrentElement(this)
		}, false);
		$("ellipse").addEventListener("click", function() {
			localStorage.highlightMode = photoshop.flag = "ellipse";
			photoshop.markCurrentElement(this)
		}, false);
		photoshop.setBlackoutColorBoxStyle();
		$("redact").addEventListener("click", function() {
			localStorage.blackoutType = "redact"
		}, false);
		$("blur").addEventListener("click", function() {
			localStorage.blackoutType = "blur"
		}, false);
		photoshop.setLineColorBoxStyle();
		photoshop.createColorPadStr($("highlightColorPad"), "highlight");
		photoshop.createColorPadStr($("fontColorPad"), "text");
		photoshop.createColorPadStr($("lineColorPad"), "line");
		$("straightLine").addEventListener("click", function() {
			localStorage.lineType = "line";
			photoshop.setLineColorBoxStyle()
		}, false);
		$("arrow").addEventListener("click", function() {
			localStorage.lineType = "arrow";
			photoshop.setLineColorBoxStyle()
		}, false);
		photoshop.setFontSize(localStorage.fontSize);
		$("size_10").addEventListener("click", function() {
			photoshop.setFontSize(10)
		}, false);
		$("size_16").addEventListener("click", function() {
			photoshop.setFontSize(16)
		}, false);
		$("size_18").addEventListener("click", function() {
			photoshop.setFontSize(18)
		}, false);
		$("size_32").addEventListener("click", function() {
			photoshop.setFontSize(32)
		}, false)
	},
	drawEllipseOnMaskCanvas: function(q, p, m, g) {
		var r = $("mask-canvas").getContext("2d");
		r.clearRect(0, 0, $("mask-canvas").width, $("mask-canvas").height);
		var o = (photoshop.startX + q) / 2;
		var n = (photoshop.startY + p) / 2;
		var c = Math.abs(q - photoshop.startX) / 2;
		var a = Math.abs(p - photoshop.startY) / 2;
		canvas.drawEllipse(r, photoshop.color, o, n, c, a, 3, photoshop.highlightType);
		if (m == "end") {
			var d = parseInt($(g).style.left);
			var b = parseInt($(g).style.top);
			var j = photoshop.startX - d;
			var h = photoshop.startY - b;
			var k = photoshop.endX - d;
			var i = photoshop.endY - b;
			o = (j + k) / 2;
			n = (h + i) / 2;
			c = Math.abs(k - j) / 2;
			a = Math.abs(i - h) / 2;
			var l = photoshop.createCanvas(g);
			l.width = Math.abs(q - photoshop.startX);
			l.height = Math.abs(p - photoshop.startY);
			var e = l.getContext("2d");
			canvas.drawEllipse(e, photoshop.color, o, n, c, a, 3, photoshop.highlightType);
			r.clearRect(0, 0, $("mask-canvas").width, $("mask-canvas").height)
		}
	},
	showTip: function(b, c, a) {
		a = a || 2000;
		var d = document.createElement("div");
		d.className = b;
		d.innerHTML = c;
		document.body.appendChild(d);
		d.style.left = (document.body.clientWidth - d.clientWidth) / 2 + "px";
		window.setTimeout(function() {
			document.body.removeChild(d)
		}, a)
	}
};
photoshop.init();
$("photo").addEventListener("mousemove", photoshop.onMouseMove, true);
$("photo").addEventListener("mousedown", photoshop.onMouseDown, true);
$("photo").addEventListener("mouseup", photoshop.onMouseUp, true);
document.addEventListener("mouseup", photoshop.onMouseUp, true);
document.addEventListener("mousemove", photoshop.onMouseMove, true);
$("canvas").addEventListener("selectstart", function f(a) {
	return false
});
$("mask-canvas").addEventListener("selectstart", function f(a) {
	return false
});
$("btnSave").addEventListener("click", photoshop.save);
$("btnClose").addEventListener("click", photoshop.closeCurrentTab);
$("btnCopy").addEventListener("click", photoshop.copy);
$("btnPrint").addEventListener("click", photoshop.printImage);
(function() {
	const a = 200;
	var h;
	var g = $("btnMore");
	var b = $("more-tools");
	var d = $("btnPrint");
	var c = bg.screenshot.isThisPlatform("mac");
	var e = bg.screenshot.isThisPlatform("linux");
	if (c) {
		UI.hide(g)
	} else {
		if (e) {
			UI.hide(d)
		}
	}
})();
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