var page = {
	startX: 150,
	startY: 150,
	endX: 400,
	endY: 300,
	moveX: 0,
	moveY: 0,
	pageWidth: 0,
	pageHeight: 0,
	visibleWidth: 0,
	visibleHeight: 0,
	dragging: false,
	moving: false,
	resizing: false,
	isMouseDown: false,
	scrollXCount: 0,
	scrollYCount: 0,
	scrollX: 0,
	scrollY: 0,
	originScrollX: 0,
	originScrollY: 0,
	captureWidth: 0,
	captureHeight: 0,
	isSelectionAreaTurnOn: false,
	fixedElements_: [],
	marginTop: 0,
	marginLeft: 0,
	modifiedBottomRightFixedElements: [],
	originalViewPortWidth: document.documentElement.clientWidth,
	defaultScrollBarWidth: 17,
	hookBodyScrollValue: function(a) {
		document.documentElement.setAttribute("__screen_capture_need_hook_scroll_value__", a);
		var b = document.createEvent("Event");
		b.initEvent("__screen_capture_check_hook_status_event__", true, true);
		document.documentElement.dispatchEvent(b)
	},
	isScrollToPageEnd: function(c) {
		var a = document.body;
		var b = document.documentElement;
		if (c == "x") {
			return b.clientWidth + a.scrollLeft == a.scrollWidth
		} else {
			if (c == "y") {
				return b.clientHeight + a.scrollTop == a.scrollHeight
			}
		}
	},
	detectPagePosition: function() {
		var a = document.body;
		var c = a.scrollTop;
		var b = a.scrollLeft;
		if (c == 0 && b == 0) {
			return "top_left"
		} else {
			if (c == 0 && this.isScrollToPageEnd("x")) {
				return "top_right"
			} else {
				if (this.isScrollToPageEnd("y") && b == 0) {
					return "bottom_left"
				} else {
					if (this.isScrollToPageEnd("y") && this.isScrollToPageEnd("x")) {
						return "bottom_right"
					}
				}
			}
		}
		return null
	},
	detectCapturePositionOfFixedElement: function(d) {
		var e = document.documentElement;
		var h = e.clientWidth;
		var f = e.clientHeight;
		var g = d.offsetWidth;
		var b = d.offsetHeight;
		var a = d.offsetTop;
		var c = d.offsetLeft;
		var i = [];
		if (a <= f - a - b) {
			i.push("top")
		} else {
			if (a < f) {
				i.push("bottom")
			}
		}
		if (c <= h - c - g) {
			i.push("left")
		} else {
			if (c < h) {
				i.push("right")
			}
		}
		if (i.length != 2) {
			return null
		}
		return i.join("_")
	},
	restoreFixedElements: function() {
		this.fixedElements_.forEach(function(a) {
			a[1].style.visibility = "visible"
		});
		this.fixedElements_ = []
	},
	cacheVisibleFixedPositionedElements: function() {
		var d = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false);
		var c;
		while (c = d.nextNode()) {
			var b = document.defaultView.getComputedStyle(c, "");
			if (!b) {
				continue
			}
			if (b.position == "fixed" && b.display != "none" && b.visibility != "hidden") {
				var a = this.detectCapturePositionOfFixedElement(c);
				if (a) {
					this.fixedElements_.push([a, c])
				}
			}
		}
	},
	handleFixedElements: function(b) {
		var c = document.documentElement;
		var a = document.body;
		if (c.clientHeight == a.scrollHeight && c.clientWidth == a.scrollWidth) {
			return
		}
		if (!this.fixedElements_.length) {
			this.cacheVisibleFixedPositionedElements()
		}
		this.fixedElements_.forEach(function(d) {
			if (d[0] == b) {
				d[1].style.visibility = "visible"
			} else {
				d[1].style.visibility = "hidden"
			}
		})
	},
	handleSecondToLastCapture: function() {
		var b = document.documentElement;
		var a = document.body;
		var g = [];
		var c = [];
		var f = this;
		this.fixedElements_.forEach(function(i) {
			var h = i[0];
			if (h == "bottom_left" || h == "bottom_right") {
				g.push(i[1])
			} else {
				if (h == "bottom_right" || h == "top_right") {
					c.push(i[1])
				}
			}
		});
		var e = a.scrollHeight - b.clientHeight - a.scrollTop;
		if (e > 0 && e < b.clientHeight) {
			g.forEach(function(h) {
				if (h.offsetHeight > e) {
					h.style.visibility = "visible";
					var i = window.getComputedStyle(h).bottom;
					f.modifiedBottomRightFixedElements.push(["bottom", h, i]);
					h.style.bottom = -e + "px"
				}
			})
		}
		var d = a.scrollWidth - b.clientWidth - a.scrollLeft;
		if (d > 0 && d < b.clientWidth) {
			c.forEach(function(h) {
				if (h.offsetWidth > d) {
					h.style.visibility = "visible";
					var i = window.getComputedStyle(h).right;
					f.modifiedBottomRightFixedElements.push(["right", h, i]);
					h.style.right = -d + "px"
				}
			})
		}
	},
	restoreBottomRightOfFixedPositionElements: function() {
		this.modifiedBottomRightFixedElements.forEach(function(d) {
			var c = d[0];
			var b = d[1];
			var a = d[2];
			b.style[c] = a
		});
		this.modifiedBottomRightFixedElements = []
	},
	hideAllFixedPositionedElements: function() {
		this.fixedElements_.forEach(function(a) {
			a[1].style.visibility = "hidden"
		})
	},
	hasScrollBar: function(c) {
		var a = document.body;
		var b = document.documentElement;
		if (c == "x") {
			if (window.getComputedStyle(a).overflowX == "scroll") {
				return true
			}
			return Math.abs(a.scrollWidth - b.clientWidth) >= page.defaultScrollBarWidth
		} else {
			if (c == "y") {
				if (window.getComputedStyle(a).overflowY == "scroll") {
					return true
				}
				return Math.abs(a.scrollHeight - b.clientHeight) >= page.defaultScrollBarWidth
			}
		}
	},
	getOriginalViewPortWidth: function() {
		chrome.runtime.sendMessage({
			msg: "original_view_port_width"
		}, function(a) {
			page.originalViewPortWidth = document.documentElement.clientWidth
		})
	},
	calculateSizeAfterZooming: function(b) {
		var a = page.originalViewPortWidth;
		var c = document.documentElement.clientWidth;
		if (a == c) {
			return b
		}
		return Math.round(a * b / c)
	},
	getZoomLevel: function() {
		return page.originalViewPortWidth / document.documentElement.clientWidth
	},
	handleRightFloatBoxInGmail: function() {
		var c = document.getElementById("canvas_frame");
		var a = document.querySelector("body > .dw");
		var b = c.contentDocument.body;
		if (b.clientHeight + b.scrollTop == b.scrollHeight) {
			a.style.display = "block"
		} else {
			a.style.display = "none"
		}
	},
	getViewPortSize: function() {
		var a = {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		};
		if (document.compatMode == "BackCompat") {
			a.width = document.body.clientWidth;
			a.height = document.body.clientHeight
		}
		return a
	},
	checkPageIsOnlyEmbedElement: function() {
		var d = document.body.children;
		var a = false;
		for (var c = 0; c < d.length; c++) {
			var b = d[c].tagName;
			if (b == "OBJECT" || b == "EMBED" || b == "VIDEO" || b == "SCRIPT" || b == "LINK") {
				a = true
			} else {
				if (d[c].style.display != "none") {
					a = false;
					break
				}
			}
		}
		return a
	},
	isGMailPage: function() {
		var a = window.location.hostname;
		if (a == "mail.google.com" && document.getElementById("canvas_frame")) {
			return true
		}
		return false
	},
	addMessageListener: function() {
		chrome.runtime.onMessage.addListener(function(c, b, a) {
			if (page.isSelectionAreaTurnOn) {
				page.removeSelectionArea()
			}
			log("in page.js onMessage, request.msg=" + c.msg);
			switch (c.msg) {
				case "capture_window":
					document.body.style.overflow = "hidden";
					window.scrollBy(1, 1);
					window.scrollBy(-1, -1);
					a(page.getWindowSize());
					break;
				case "gtools_scp_show_selection_area":
					page.showSelectionArea();//这个可能是截图插件
					break;
				case "scroll_init":
					document.body.style.overflow = "hidden";
					window.scrollBy(1, 1);
					window.scrollBy(-1, -1);
					a(page.scrollInit(0, 0, document.documentElement.scrollWidth, document.documentElement.scrollHeight, "captureWhole"));
					break;
				case "gtools_scp_scroll_next":
					document.body.style.overflow = "hidden";
					window.scrollBy(1, 1);
					window.scrollBy(-1, -1);
					page.visibleWidth = c.visibleWidth;
					page.visibleHeight = c.visibleHeight;
					result = page.scrollNext();
					a(result);
					break;
				case "gtools_scp_capture_selected":
					document.body.style.overflow = "hidden";
					window.scrollBy(1, 1);
					window.scrollBy(-1, -1);
					// console.log(page.startX,page.startY,page.endX)
					// 这个位置是确定截取位置
					page.startX += 12;
					page.endX += 24;
					a(page.scrollInit(page.startX, page.startY, page.calculateSizeAfterZooming(page.endX - page.startX), page.calculateSizeAfterZooming(page.endY - page.startY), "captureSelected"));
					break;
				case "gtools_scp_restore_scrollbar":
					document.body.style.overflow = "";
					window.scrollBy(1, 1);
					window.scrollBy(-1, -1);
					break;
				case "getNewLocality":
					if (typeof getNewLocality != "undefined" && getNewLocality) {
						setTimeout(getNewLocality(), 500)
					}
					break
			}
		})
	},
	sendMessage: function(a) {
		chrome.runtime.sendMessage(a)
	},
	scrollInit: function(f, d, c, e, h) {
		var i = page.isThisPlatform("mac") ? 1 : 1;
		this.hookBodyScrollValue(true);
		page.captureHeight = e;
		page.captureWidth = c;
		var g = document.body.scrollWidth;
		var j = document.body.scrollHeight;
		page.originScrollX = window.scrollX;
		page.originScrollY = window.scrollY;
		window.scrollTo(f, d);
		this.handleFixedElements("top_left");
		this.handleSecondToLastCapture();
		if (page.isGMailPage() && h == "captureWhole") {
			var b = document.getElementById("canvas_frame");
			j = page.captureHeight = e = b.contentDocument.height;
			g = page.captureWidth = c = b.contentDocument.width;
			b.contentDocument.body.scrollTop = 0;
			b.contentDocument.body.scrollLeft = 0;
			page.handleRightFloatBoxInGmail()
		}
		page.scrollXCount = 0;
		page.scrollYCount = 1;
		page.scrollX = window.scrollX;
		page.scrollY = window.scrollY;
		var a = page.getViewPortSize();
		return {
			msg: "gtools_scp_scroll_init_done",
			startX: page.calculateSizeAfterZooming(f) * i,
			startY: page.calculateSizeAfterZooming(d) * i,
			scrollX: window.scrollX * i,
			scrollY: window.scrollY * i,
			docHeight: j * i,
			docWidth: g * i,
			visibleWidth: a.width * i,
			visibleHeight: a.height * i,
			canvasWidth: c * i,
			canvasHeight: e * i,
			scrollXCount: 0,
			scrollYCount: 0,
			zoom: page.getZoomLevel()
		}
	},
	scrollNext: function() {
		log("page.visibleWidth=" + page.visibleWidth + " page.captureWidth=" + page.captureWidth);
		if (page.scrollYCount * page.visibleWidth >= page.captureWidth) {
			page.scrollXCount++;
			page.scrollYCount = 0
		}
		log("page.scrollXCount=" + page.scrollXCount + " page.visibleHeight=" + page.visibleHeight + " page.captureHeight=" + page.captureHeight);
		if (page.scrollXCount * page.visibleHeight < page.captureHeight) {
			this.restoreBottomRightOfFixedPositionElements();
			var b = page.getViewPortSize();
			window.scrollTo(page.scrollYCount * b.width + page.scrollX, page.scrollXCount * b.height + page.scrollY);
			var c = this.detectPagePosition();
			if (c) {
				this.handleFixedElements(c)
			} else {
				this.hideAllFixedPositionedElements()
			}
			this.handleSecondToLastCapture();
			if (page.isGMailPage()) {
				var d = document.getElementById("canvas_frame");
				d.contentDocument.body.scrollLeft = page.scrollYCount * b.width;
				d.contentDocument.body.scrollTop = page.scrollXCount * b.height;
				page.handleRightFloatBoxInGmail()
			}
			var a = page.scrollXCount;
			var e = page.scrollYCount;
			page.scrollYCount++;
			return {
				msg: "gtools_scp_scroll_next_done",
				scrollXCount: a,
				scrollYCount: e
			}
		} else {
			window.scrollTo(page.originScrollX, page.originScrollY);
			this.restoreFixedElements();
			this.hookBodyScrollValue(false);
			return {
				msg: "gtools_scp_scroll_finished"
			}
		}
	},
	showSelectionArea: function() {
		page.createFloatLayer();
		setTimeout(page.createSelectionArea, 100)
	},
	getWindowSize: function() {
		var b = document.documentElement.offsetWidth;
		var a = document.documentElement.offsetHeight;
		if (page.isGMailPage()) {
			var c = document.getElementById("canvas_frame");
			a = c.contentDocument.height;
			b = c.contentDocument.width
		}
		return {
			msg: "capture_window",
			docWidth: b,
			docHeight: a
		}
	},
	getSelectionSize: function() {
		page.removeSelectionArea();
		setTimeout(function() {
			page.sendMessage({
				msg: "gtools_scp_capture_selected",
				x: page.startX,
				y: page.startY,
				width: page.endX - page.startX,
				height: page.endY - page.startY,
				visibleWidth: document.documentElement.clientWidth,
				visibleHeight: document.documentElement.clientHeight,
				docWidth: document.width,
				docHeight: document.height
			})
		}, 100)
	},
	createFloatLayer: function() {
		page.createDiv(document.body, "sc_drag_area_protector")
	},
	matchMarginValue: function(a) {
		return a.match(/\d+/)
	},
	createSelectionArea: function() {
		var f = $("sc_drag_area_protector");
		var e = page.getZoomLevel();
		var a = window.getComputedStyle(document.body, null);
		if ("relative" == a.position) {
			page.marginTop = page.matchMarginValue(a.marginTop);
			page.marginLeft = page.matchMarginValue(a.marginLeft);
			f.style.top = -parseInt(page.marginTop) + "px";
			f.style.left = -parseInt(page.marginLeft) + "px"
		}
		f.style.width = Math.round((document.body.clientWidth + parseInt(page.marginLeft)) / e) + "px";
		f.style.height = Math.round((document.body.clientHeight + parseInt(page.marginTop)) / e) + "px";
		f.onclick = function() {
			event.stopPropagation();
			return false
		};
		page.createDiv(f, "sc_drag_shadow_top");
		page.createDiv(f, "sc_drag_shadow_bottom");
		page.createDiv(f, "sc_drag_shadow_left");
		page.createDiv(f, "sc_drag_shadow_right");
		var b = page.createDiv(f, "sc_drag_area");
		page.createDiv(b, "sc_drag_container");
		page.createDiv(b, "sc_drag_size");
		var d = page.createDiv(b, "gtools_scp_drag_cancel");
		d.addEventListener("mousedown", function() {
			page.removeSelectionArea()
		}, true);
		d.innerHTML = chrome.i18n.getMessage("cancel");
		var c = page.createDiv(b, "gtools_scp_drag_crop");
		c.addEventListener("mousedown", function() {
			page.removeSelectionArea();
			page.sendMessage({
				msg: "gtools_scp_capture_selected"
			})
		}, false);
		c.innerHTML = chrome.i18n.getMessage("ok");
		page.createDiv(b, "sc_drag_north_west");
		page.createDiv(b, "sc_drag_north_east");
		page.createDiv(b, "sc_drag_south_east");
		page.createDiv(b, "sc_drag_south_west");
		f.addEventListener("mousedown", page.onMouseDown, false);
		document.addEventListener("mousemove", page.onMouseMove, false);
		document.addEventListener("mouseup", page.onMouseUp, false);
		$("sc_drag_container").addEventListener("dblclick", function() {
			//双击 截图入口
			page.removeSelectionArea();
			page.sendMessage({
				msg: "gtools_scp_capture_selected"
			})
		}, false);
		page.pageHeight = $("sc_drag_area_protector").clientHeight;
		page.pageWidth = $("sc_drag_area_protector").clientWidth;
		var b = $("sc_drag_area");
		// 这个位置是 改变 截图区域的 出现位置
		// b.style.width = "980px";
		// b.style.height = "730px";

		b.style.left = page.getElementLeft(b) + "px";
		b.style.top = page.getElementTop(b) + "px";
		page.startX = page.getElementLeft(b);
		page.startY = page.getElementTop(b);
		page.endX = page.getElementLeft(b) + 250;
		page.endY = page.getElementTop(b) + 730;
		//
		var ddd = document.getElementById('contentIframe');
		if(ddd){
			var doc = ddd.contentWindow.document;
			console.log(doc.getElementById('title').innerHTML);
		}
		b.style.width = "980px";
		b.style.height = "730px";
		c.style.top = 0;
		d.style.top = 0;
		c.style.right = b.clientWidth / 2 + 10 + "px";
		d.style.left = b.clientWidth / 2 + 10 + "px";
		page.isSelectionAreaTurnOn = true;
		page.updateShadow(b);
		page.updateSize()
	},
	getElementLeft: function(a) {
		return (document.body.scrollLeft + (document.documentElement.clientWidth - a.offsetWidth) / 2)
	},
	getElementTop: function(a) {
		return (document.body.scrollTop + (document.documentElement.clientHeight - a.offsetHeight) / 2)
	},
	onMouseDown: function() {
		if (event.button != 2) {
			var c = event.target;
			if (c) {
				var a = c.tagName;
				if (a && document) {
					page.isMouseDown = true;
					var b = $("sc_drag_area");
					var e = event.pageX;
					var d = event.pageY;
					if (b) {
						if (c == $("sc_drag_container")) {
							page.moving = true;
							page.moveX = e - b.offsetLeft;
							page.moveY = d - b.offsetTop
						} else {
							if (c == $("sc_drag_north_east")) {
								page.resizing = true;
								page.startX = b.offsetLeft;
								page.startY = b.offsetTop + b.clientHeight
							} else {
								if (c == $("sc_drag_north_west")) {
									page.resizing = true;
									page.startX = b.offsetLeft + b.clientWidth;
									page.startY = b.offsetTop + b.clientHeight
								} else {
									if (c == $("sc_drag_south_east")) {
										page.resizing = true;
										page.startX = b.offsetLeft;
										page.startY = b.offsetTop
									} else {
										if (c == $("sc_drag_south_west")) {
											page.resizing = true;
											page.startX = b.offsetLeft + b.clientWidth;
											page.startY = b.offsetTop
										} else {
											page.dragging = true;
											page.endX = 0;
											page.endY = 0;
											page.endX = page.startX = e;
											page.endY = page.startY = d
										}
									}
								}
							}
						}
					}
					event.preventDefault()
				}
			}
		}
	},
	onMouseMove: function() {
		var e = event.target;
		if (e && page.isMouseDown) {
			var k = $("sc_drag_area");
			if (k) {
				var b = event.pageX;
				var j = event.pageY;
				if (page.dragging || page.resizing) {
					var c = 0;
					var l = 0;
					var n = page.getZoomLevel();
					var i = Math.round(document.width / n);
					var d = Math.round(document.height / n);
					if (b > i) {
						b = i
					} else {
						if (b < 0) {
							b = 0
						}
					}
					if (j > d) {
						j = d
					} else {
						if (j < 0) {
							j = 0
						}
					}
					page.endX = b;
					page.endY = j;
					if (page.startX > page.endX) {
						c = page.startX - page.endX;
						k.style.left = b + "px"
					} else {
						c = page.endX - page.startX;
						k.style.left = page.startX + "px"
					}
					if (page.startY > page.endY) {
						l = page.startY - page.endY;
						k.style.top = page.endY + "px"
					} else {
						l = page.endY - page.startY;
						k.style.top = page.startY + "px"
					}
					// k.style.height = l + "px";//高度不变
					k.style.width = c + "px";
					if (window.innerWidth < b) {
						document.body.scrollLeft = b - window.innerWidth
					}
					if (document.body.scrollTop + window.innerHeight < j + 25) {
						document.body.scrollTop = j - window.innerHeight + 25
					}
					if (j < document.body.scrollTop) {
						document.body.scrollTop -= 25
					}
				} else {
					if (page.moving) {
						var a = b - page.moveX;
						var h = j - page.moveY;
						if (a < 0) {
							a = 0
						} else {
							if (a + k.clientWidth > page.pageWidth) {
								a = page.pageWidth - k.clientWidth
							}
						}
						if (h < 0) {
							h = 0
						} else {
							if (h + k.clientHeight > page.pageHeight) {
								h = page.pageHeight - k.clientHeight
							}
						}
						k.style.left = a + "px";
						k.style.top = h + "px";
						page.endX = a + k.clientWidth;
						page.startX = a;
						page.endY = h + k.clientHeight;
						page.startY = h
					}
				}
				var g = document.getElementById("gtools_scp_drag_crop");
				var m = document.getElementById("gtools_scp_drag_cancel");
				g.style.right = k.clientWidth / 2 + 10 + "px";
				m.style.left = k.clientWidth / 2 + 10 + "px";
				var f = document.getElementById("sc_drag_size");
				if (event.pageY < 18) {
					f.style.top = 0
				} else {
					f.style.top = "-18px"
				}
				page.updateShadow(k);
				page.updateSize()
			}
		}
	},
	onMouseUp: function() {
		page.isMouseDown = false;
		if (event.button != 2) {
			page.resizing = false;
			page.dragging = false;
			page.moving = false;
			page.moveX = 0;
			page.moveY = 0;
			var a;
			if (page.endX < page.startX) {
				a = page.endX;
				page.endX = page.startX;
				page.startX = a
			}
			if (page.endY < page.startY) {
				a = page.endY;
				page.endY = page.startY;
				page.startY = a
			}
		}
	},
	updateShadow: function(b) {
		$("sc_drag_shadow_top").style.height = parseInt(b.style.top) + "px";
		$("sc_drag_shadow_top").style.width = (parseInt(b.style.left) + parseInt(b.style.width) + 1) + "px";
		$("sc_drag_shadow_left").style.height = (page.pageHeight - parseInt(b.style.top)) + "px";
		$("sc_drag_shadow_left").style.width = parseInt(b.style.left) + "px";
		var a = (parseInt(b.style.top) + parseInt(b.style.height) + 1);
		a = (a < 0) ? 0 : a;
		var c = (page.pageWidth) - 1 - (parseInt(b.style.left) + parseInt(b.style.width));
		c = (c < 0) ? 0 : c;
		$("sc_drag_shadow_right").style.height = a + "px";
		$("sc_drag_shadow_right").style.width = c + "px";
		a = (page.pageHeight - 1 - (parseInt(b.style.top) + parseInt(b.style.height)));
		a = (a < 0) ? 0 : a;
		c = (page.pageWidth) - parseInt(b.style.left);
		c = (c < 0) ? 0 : c;
		$("sc_drag_shadow_bottom").style.height = a + "px";
		$("sc_drag_shadow_bottom").style.width = c + "px"
	},
	removeSelectionArea: function() {
		document.removeEventListener("mousedown", page.onMouseDown, false);
		document.removeEventListener("mousemove", page.onMouseMove, false);
		document.removeEventListener("mouseup", page.onMouseUp, false);
		$("sc_drag_container").removeEventListener("dblclick", function() {
			page.removeSelectionArea();
			page.sendMessage({
				msg: "gtools_scp_capture_selected"
			})
		}, false);
		page.removeElement("sc_drag_area_protector");
		page.removeElement("sc_drag_area");
		page.isSelectionAreaTurnOn = false
	},
	updateSize: function() {
		var b = Math.abs(page.endX - page.startX);
		var a = Math.abs(page.endY - page.startY);
		$("sc_drag_size").innerText = page.calculateSizeAfterZooming(b) + " x " + page.calculateSizeAfterZooming(a)
	},
	createDiv: function(b, c) {
		var a = document.createElement("div");
		a.id = c;
		b.appendChild(a);
		return a
	},
	removeElement: function(a) {
		if ($(a)) {
			$(a).parentNode.removeChild($(a))
		}
	},
	injectCssResource: function(a) {
		var b = document.createElement("LINK");
		b.type = "text/css";
		b.rel = "stylesheet";
		b.href = chrome.extension.getURL(a);
		(document.head || document.body || document.documentElement).appendChild(b)
	},
	injectJavaScriptResource: function(a) {
		var b = document.createElement("script");
		b.type = "text/javascript";
		b.charset = "utf-8";
		b.src = chrome.extension.getURL(a);
		(document.head || document.body || document.documentElement).appendChild(b)
	},
	init: function() {
		if (document.body.hasAttribute("gtools_scp_screen_capture_injected")) {
			return
		}
		if (isPageCapturable()) {
			chrome.runtime.sendMessage({
				msg: "page_capturable"
			})
		} else {
			chrome.runtime.sendMessage({
				msg: "page_uncapturable"
			})
		}
		this.injectCssResource("style.css");
		this.addMessageListener();
		this.injectJavaScriptResource("page_context.js");
		page.getOriginalViewPortWidth()
	},
	isThisPlatform: function(a) {
		return navigator.userAgent.toLowerCase().indexOf(a) > -1
	}
};
var isPageCapturable = function() {
	return !page.checkPageIsOnlyEmbedElement()
};

function $(a) {
	return document.getElementById(a)
}



// chrome.commands.onCommand.addListener(function(command) {
//         console.log('Command:', command);
//       });

page.init();

function log(a) {
	var b = false;
	if (b) {
		console.log(a)
	}
}
window.addEventListener("resize", function() {
	if (page.isSelectionAreaTurnOn) {
		page.removeSelectionArea();
		page.showSelectionArea()
	}
	page.getOriginalViewPortWidth()
}, false);
page.sendMessage({
	msg: "url_for_access_token",
	url: window.location.href
});
// var $$ = jQuery;

// function clickable_links() {
// 	if (/https|ftp|file/.test(location.protocol)) {
// 		return
// 	}
// 	if (/localhost|:\d+|bing|google|baidu|(\d+\.){3}\d+/i.test(location.host)) {
// 		return
// 	}
// 	var a = "http://www.google.com/search?q=$1";
// 	if (navigator.language.indexOf("zh") !== -1) {
// 		a = "http://www.baidu.com/s?wd=$1&ie=utf-8&tn=94749616_hao_pg"
// 	}
// 	$$("body *").replaceText(/(“.{3,4}”|“.{5,6}”|婴儿车|婴儿奶粉|双色球|英雄联盟|乐视网|京东|不孕不育|减肥|英语培训|辅导课|MBA报名)/gi, '<a class="skylink" target="_blank" href="' + a + '">$1</a>')
// }
// clickable_links();