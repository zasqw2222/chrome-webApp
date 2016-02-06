function $(a) {
	return document.getElementById(a)
}

function isWindowsOrLinuxPlatform() {
	return navigator.userAgent.toLowerCase().indexOf("windows") > -1 || navigator.userAgent.toLowerCase().indexOf("linux") > -1
}
var isWindowsOrLinux = isWindowsOrLinuxPlatform();
chrome.extension.onRequest.addListener(function(c, b, a) {
	if (c.msg == "page_capturable") {
		$("tip").style.display = "none";
		$("captureSpecialPageItem").style.display = "none";
		if (isWindowsOrLinux) {
			$("captureScreenItem").style.display = "block"
		}
		$("captureWindowItem").style.display = "block";
		$("captureAreaItem").style.display = "block";
		$("captureWebpageItem").style.display = "block"
	} else {
		if (c.msg == "page_uncapturable") {
			i18nReplace("tip", "special");
			if (isWindowsOrLinux) {
				$("captureScreenItem").style.display = "block";
				$("tip").style.display = "none"
			} else {
				$("tip").style.display = "block"
			}
			$("captureSpecialPageItem").style.display = "none";
			$("captureWindowItem").style.display = "none";
			$("captureAreaItem").style.display = "none";
			$("captureWebpageItem").style.display = "none"
		}
	}
});

function toDo(b) {
	// 返回运行在当前应用中的后台网页的 JavaScript window 对象。
	// 如果应用没有后台网页则返回 null
	var a = chrome.extension.getBackgroundPage();
	switch (b) {
		case "capture_screen":
			a.screenshot.captureScreen();
			window.close();
			break;
		case "capture_window":
			a.screenshot.captureWindow();
			window.close();
			break;
			// 区域截图
		case "gtools_scp_capture_area":
			a.screenshot.showSelectionArea();
			window.close();
			break;
		case "capture_webpage":
			a.screenshot.captureWebpage();
			$("loadDiv").style.display = "block";
			$("item").style.display = "none";
			break;
		case "capture_special_page":
			a.screenshot.captureSpecialPage();
			window.close();
			break
	}
}

function i18nReplace(b, a) {
	return $(b).innerHTML = chrome.i18n.getMessage(a)
}

function resizeDivWidth(b, a) {
	$(b).style.width = a + "px"
}

function init() {
	// chrome.storage.local.set({
	// 		tv : 'png',
	// 		min : 250,
	// 		max : 150,
	// 		val : 0.8
	// });
	i18nReplace("captureSpecialPageText", "capture_window");
	i18nReplace("capturing", "capturing");
	i18nReplace("captureScreenText", "capture_screen");
	i18nReplace("captureWindowText", "capture_window");
	i18nReplace("captureAreaText", "capture_area");
	i18nReplace("captureWebpageText", "capture_webpage");
	if (HotKey.isEnabled()) {
		$("captureWindowShortcut").style.display = "inline";
		$("captureAreaShortcut").style.display = "inline";
		$("captureWebpageShortcut").style.display = "inline";
		if (isWindowsOrLinux) {
			$("captureScreenShortcut").style.display = "inline"
		}
		document.body.style.minWidth = "190px"
	} else {
		$("captureWindowShortcut").style.display = "none";
		$("captureAreaShortcut").style.display = "none";
		$("captureWebpageShortcut").style.display = "none";
		if (isWindowsOrLinux) {
			$("captureScreenShortcut").style.display = "none"
		}
		document.body.style.minWidth = "140px"
	}
	var b = false;
	chrome.tabs.getSelected(null, function(c) {
		if (c.url.indexOf("chrome") == 0 || c.url.indexOf("about") == 0) {
			i18nReplace("tip", "special");
			if (isWindowsOrLinux) {
				$("captureScreenItem").style.display = "block";
				$("tip").style.display = "none"
			}
			return
		} else {
			$("tip").style.display = "none";
			$("captureSpecialPageItem").style.display = "block";
			if (isWindowsOrLinux) {
				$("captureScreenItem").style.display = "block"
			}
		}
		chrome.tabs.sendRequest(c.id, {
			msg: "is_page_capturable"
		}, function(d) {
			b = true;
			if (d.msg == "capturable") {
				$("tip").style.display = "none";
				if (isWindowsOrLinux) {
					$("captureScreenItem").style.display = "block"
				}
				$("captureSpecialPageItem").style.display = "none";
				$("captureWindowItem").style.display = "block";
				$("captureAreaItem").style.display = "block";
				$("captureWebpageItem").style.display = "block";
				var f = $("captureWindowText")["scrollWidth"];
				resizeDivWidth("captureWindowText", f);
				resizeDivWidth("captureAreaText", f);
				resizeDivWidth("captureWebpageText", f);
				var e = chrome.extension.getBackgroundPage();
				if (e.screenshot.isThisPlatform("mac")) {
					$("captureAreaShortcut").innerText = "\u2325\u2318R";
					$("captureWindowShortcut").innerText = "\u2325\u2318V";
					$("captureWebpageShortcut").innerText = "\u2325\u2318H"
				}
			} else {
				if (d.msg == "uncapturable") {
					i18nReplace("tip", "special");
					if (isWindowsOrLinux) {
						$("captureScreenItem").style.display = "block";
						$("tip").style.display = "none"
					} else {
						$("tip").style.display = "block"
					}
				} else {
					i18nReplace("tip", "loading")
				}
			}
		})
	});
	chrome.tabs.executeScript(null, {
		file: "isLoad.js"
	});
	var a = function() {
		if (b == false) {
			chrome.tabs.getSelected(null, function(f) {
				if (f.url.indexOf("chrome") == 0 || f.url.indexOf("about") == 0) {
					i18nReplace("tip", "special")
				} else {
					$("tip").style.display = "none";
					$("captureSpecialPageItem").style.display = "block"
				}
			});
			if (isWindowsOrLinux) {
				$("captureScreenItem").style.display = "block";
				$("tip").style.display = "none"
			}
		}
		var e = document.querySelectorAll("li.menuI");
		var d = false;
		for (var c = 0; c < e.length; c++) {
			if (window.getComputedStyle(e[c]).display != "none") {
				d = true;
				break
			}
		}
		$("separatorItem").style.display = d ? "block" : "none"
	};
	setTimeout(a, 500);
	if (HotKey.get("area") != "@") {
		$("captureAreaShortcut").innerText = "Ctrl+Alt+" + HotKey.get("area")
	}
	if (HotKey.get("viewport") != "@") {
		$("captureWindowShortcut").innerText = "Ctrl+Alt+" + HotKey.get("viewport")
	}
	if (HotKey.get("fullpage") != "@") {
		$("captureWebpageShortcut").innerText = "Ctrl+Alt+" + HotKey.get("fullpage")
	}
	if (HotKey.get("screen") != "@") {
		$("captureScreenShortcut").innerText = "Ctrl+Alt+" + HotKey.get("screen")
	}
	$("captureSpecialPageItem").addEventListener("click", function(c) {
		toDo("capture_special_page")
	});
	// 区域截图
	$("captureAreaItem").addEventListener("click", function(c) {
		toDo("gtools_scp_capture_area")
	});
	$("captureWindowItem").addEventListener("click", function(c) {
		toDo("capture_window")
	});
	$("captureWebpageItem").addEventListener("click", function(c) {
		toDo("capture_webpage")
	});
	$("captureScreenItem").addEventListener("click", function(c) {
		toDo("capture_screen")
	})
}
document.addEventListener("DOMContentLoaded", init);