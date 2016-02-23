function init() {
	var b = chrome.extension.getBackgroundPage();
	var d = document.getElementById("tip");
	var a = b.screenshot.captureStatus;
	if (a) {
		d.innerText = chrome.i18n.getMessage("save_success");
		var c = document.createElement("a");
		c.innerText = chrome.i18n.getMessage("open_save_path");
		c.href = "javascript:void(0)";
		c.addEventListener("click", function() {
			b.plugin.openSavePath(localStorage.savePath)
		}, false);
		d.appendChild(c)
	} else {
		d.innerText = chrome.i18n.getMessage("save_fail")
	}
	closeWindow()
}

function closeWindow() {
	window.setTimeout(function() {
		window.close()
	}, 10000)
}
document.addEventListener("DOMContentLoaded", init);