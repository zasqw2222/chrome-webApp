var bg = chrome.extension.getBackgroundPage();

function $(a) {
	return document.getElementById(a)
}

function isHighVersion() {
	var a = navigator.userAgent.match(/Chrome\/(\d+)/)[1];
	return a > 9
}

function init() {
	i18nReplace("optionTitle", "options");
	i18nReplace("saveAndClose", "save_and_close");
	i18nReplace("screenshootQualitySetting", "quality_setting");
	i18nReplace("lossyScreenShot", "lossy");
	i18nReplace("losslessScreenShot", "lossless");
	i18nReplace("autosaveSetting", "save_setting");
	i18nReplace("shorcutSetting", "shortcut_setting");
	i18nReplace("settingShortcutText", "shortcutsetting_text");
	i18nReplace("defaultPath", "save_tip");
	i18nReplace("autosaveText", "autosave");
	i18nReplace("setSavePath", "set_save_path");
	i18nReplace("openSavePath", "open_save_path");
	if (isHighVersion()) {
		$("lossyScreenShot").innerText += " (JPEG)";
		$("losslessScreenShot").innerText += " (PNG)"
	}
	$("autosave").checked = eval(localStorage.autoSave);
	$("filePath").value = localStorage.savePath = localStorage.savePath ? localStorage.savePath : bg.plugin.getDefaultSavePath();
	$("setSavePath").addEventListener("click", function() {});
	$("openSavePath").addEventListener("click", function() {
		bg.plugin.openSavePath(localStorage.savePath)
	});
	$("saveAndClose").addEventListener("click", saveAndClose);
	initScreenCaptureQuality();
	HotKeySetting.setup()
}

function save() {
	localStorage.screenshootQuality = $("lossy").checked ? "jpeg" : "" || $("lossless").checked ? "png" : "";
	localStorage.autoSave = $("autosave").checked;
	return HotKeySetting.save()
}

function saveAndClose() {
	if (save()) {
		chrome.tabs.getSelected(null, function(a) {
			chrome.tabs.remove(a.id)
		})
	}
}

function initScreenCaptureQuality() {
	$("lossy").checked = localStorage.screenshootQuality == "jpeg";
	$("lossless").checked = localStorage.screenshootQuality == "png"
}

function i18nReplace(b, a) {
	return $(b).innerText = chrome.i18n.getMessage(a)
}
const CURRENT_LOCALE = chrome.i18n.getMessage("@@ui_locale");
if (CURRENT_LOCALE != "zh_CN") {
	UI.addStyleSheet("./i18n_styles/en_options.css")
}

function isWindowsOrLinuxPlatform() {
	return navigator.userAgent.toLowerCase().indexOf("windows") > -1 || navigator.userAgent.toLowerCase().indexOf("linux") > -1
}
var HotKeySetting = (function() {
	const f = 64;
	const e = 65;
	const d = 90;
	var b = null;
	var c = isWindowsOrLinuxPlatform();
	var a = {
		setup: function() {
			b = document.querySelectorAll("#hot-key-setting select");
			$("area-capture-text").innerText = chrome.i18n.getMessage("capture_area");
			$("viewport-capture-text").innerText = chrome.i18n.getMessage("capture_window");
			$("full-page-capture-text").innerText = chrome.i18n.getMessage("capture_webpage");
			$("screen-capture-text").innerText = chrome.i18n.getMessage("capture_screen");
			for (var h = 0; h < b.length; h++) {
				b[h].add(new Option("--", "@"));
				for (var g = e; g <= d; g++) {
					var l = String.fromCharCode(g);
					var k = new Option(l, l);
					b[h].add(k)
				}
			}
			$("area-capture-hot-key").selectedIndex = HotKey.getCharCode("area") - f;
			$("viewport-capture-hot-key").selectedIndex = HotKey.getCharCode("viewport") - f;
			$("full-page-capture-hot-key").selectedIndex = HotKey.getCharCode("fullpage") - f;
			$("screen-capture-hot-key").selectedIndex = HotKey.getCharCode("screen") - f;
			$("settingShortcut").addEventListener("click", function() {
				a.setState(this.checked)
			}, false);
			a.setState(HotKey.isEnabled());
			if (c) {
				$("screen-capture-hot-key-set-wrapper").style.display = "inline-block"
			}
		},
		validate: function() {
			var g = Array.prototype.filter.call(b, function(i) {
				return i.value != "@"
			}).length;
			if (g != 0) {
				var h = {};
				h[b[0].value] = true;
				h[b[1].value] = true;
				h[b[2].value] = true;
				if (c) {
					h[b[3].value] = true
				} else {
					if (b[3].value != "@") {
						g -= 1
					}
				}
				if (Object.keys(h).length < g) {
					ErrorInfo.show("hot_key_conflict");
					return false
				}
			}
			ErrorInfo.hide();
			return true
		},
		save: function() {
			var g = true;
			if ($("settingShortcut").checked) {
				if (this.validate()) {
					HotKey.enable();
					HotKey.set("area", $("area-capture-hot-key").value);
					HotKey.set("viewport", $("viewport-capture-hot-key").value);
					HotKey.set("fullpage", $("full-page-capture-hot-key").value);
					if (c) {
						var i = $("screen-capture-hot-key").value;
						if (bg.plugin.setHotKey(i.charCodeAt(0))) {
							HotKey.set("screen", i)
						} else {
							var h = "failed_to_register_hot_key_for_screen_capture";
							ErrorInfo.show(h);
							this.focusScreenCapture();
							g = false
						}
					}
				} else {
					g = false
				}
			} else {
				HotKey.disable(bg)
			}
			return g
		},
		setState: function(g) {
			$("settingShortcut").checked = g;
			UI.setStyle($("hot-key-setting"), "color", g ? "" : "#6d6d6d");
			for (var h = 0; h < b.length; h++) {
				b[h].disabled = !g
			}
			ErrorInfo.hide()
		},
		focusScreenCapture: function() {
			$("screen-capture-hot-key").focus()
		}
	};
	return a
})();
var ErrorInfo = (function() {
	return {
		show: function(c) {
			var a = $("error-info");
			var b = chrome.i18n.getMessage(c);
			a.innerText = b;
			UI.show(a)
		},
		hide: function() {
			var a = $("error-info");
			if (a) {
				UI.hide(a)
			}
		}
	}
})();
document.addEventListener("DOMContentLoaded", init);