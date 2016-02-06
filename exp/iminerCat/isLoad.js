function log(a) {
	var b = false;
	if (b) {
		console.log(a)
	}
}

function checkScriptLoad() {
	chrome.extension.onRequest.addListener(function(c, b, a) {
		if (c.msg == "is_page_capturable") {
			try {
				if (isPageCapturable()) {
					a({
						msg: "capturable"
					})
				} else {
					a({
						msg: "uncapturable"
					})
				}
			} catch (d) {
				a({
					msg: "loading"
				})
			}
		}
	})
}
checkScriptLoad();