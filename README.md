# chrome-webApp
一些关于学习制作 chrome插件的一些记录

# permissions 权限说明  

+ `"activeTab"	  根据` [activeTab](http://chajian.baidu.com/developer/extensions/activeTab.html) `规范请求授予应用权限。`  
+ ` "alarms"	使您的应用能够访问 `[chrome.alarms API](http://chajian.baidu.com/developer/extensions/alarms.html)
+ `"browsingData"	使您的应用能够访问` [chrome.browsingData API](http://chajian.baidu.com/developer/extensions/browsingData.html)
+ `"clipboardRead"	如果应用或应用使用javascript document.execCommand('paste')则必须指定。`
+ `"clipboardWrite"	表示应用或应用可以使用 document.execCommand('copy') 或 document.execCommand('cut')。托管应用必须指定该权限，建议应用和打包应用也指定该权限。`
+ `"contextMenus"	使您的应用能够访问 `[chrome.contextMenus API](http://chajian.baidu.com/developer/extensions/contextMenus.html)`.`
+ `"cookies"	使您的应用能够访问` [chrome.cookies API](http://chajian.baidu.com/developer/extensions/cookies.html)`.`
+ `"geolocation"	允许应用或应用使用提议的 HTML5 `[地理定位 API](http://dev.w3.org/geo/api/spec-source.html) `而不需要提示用户权限。`
+ `"management"	使您的应用能够访问` [chrome.management API](http://chajian.baidu.com/developer/extensions/management.html)`。`
+ `"nativeMessaging"	使您的应用能够访问`[原生消息通信 API](http://chajian.baidu.com/developer/extensions/messaging.html#native-messaging)`。`
+ `"notifications"	允许应用使用提议的 HTML5 `[通知 API](http://www.chromium.org/developers/design-documents/desktop-notifications/api-specification)` 而不用调用权限方法（例如 checkPermission()）。有关更多信息，请参见桌面通知。`
+ `"pageCapture"	使您的应用能够访问 `[chrome.pageCapture API](http://chajian.baidu.com/developer/extensions/pageCapture.html)`。`
+ `"power"	使您的应用能够访问 `[chrome.power API](http://chajian.baidu.com/developer/extensions/power.html)`。`
+ `"proxy"	使您的应用能够访问 `[chrome.proxy API](http://chajian.baidu.com/developer/extensions/proxy.html)`。`
+ `"storage"	使您的应用能够访问 `[chrome.storage API](http://chajian.baidu.com/developer/extensions/storage.html)`。`
+ `"system.cpu"	使您的应用能够访问 `[chrome.system.cpu API](http://chajian.baidu.com/developer/extensions/storage.html)`。`
+ `"system.display"	使您的应用能够访问 `[chrome.system.display API](http://chajian.baidu.com/developer/extensions/system.display)`。`
+ `"system.memory"	使您的应用能够访问 `[chrome.system.memory API](http://chajian.baidu.com/developer/extensions/system.display)`。`
+ `"system.storage"	使您的应用能够访问 `[chrome.system.storage API](http://chajian.baidu.com/developer/extensions/system.storage)`。`
+ `"tabs"	使您的应用能够访问 `[Tab](http://chajian.baidu.com/developer/extensions/tabs.html#type-Tab)` 对象的特权字段，包括 `[chrome.tabs](http://chajian.baidu.com/developer/extensions/tabs.html)` 和 `[chrome.windows](http://chajian.baidu.com/developer/extensions/windows.html)` 在内的多种 API 都使用 Tab 对象。在很多情况下，您的应用不需要声明 "tabs" 权限就能使用这些 API。`
+ `"tts"	使您的应用能够访问 `[chrome.tts API](http://chajian.baidu.com/developer/extensions/tts.html)`。`
+ `"ttsEngine"	使您的应用能够访问 `[chrome.ttsEngine API](http://chajian.baidu.com/developer/extensions/ttsEngine.html)`。`
+ `"unlimitedStorage"	提供无限的存储空间，保存 HTML5 客户端数据，例如数据库以及本地存储文件。如果没有这一权限，应用或应用的本地存储将限制在 5 MB 以内。`


+ `"webNavigation"	使您的应用能够访问 `[chrome.webNavigation API](http://chajian.baidu.com/developer/extensions/webNavigation.html)`。`
+ `"webRequest"	使您的应用能够访问 `[chrome.webRequest API](http://chajian.baidu.com/developer/extensions/webRequest.html)`。`
+ `"webRequestBlocking"	如果应用以阻塞方式使用 `[chrome.webRequest API](http://chajian.baidu.com/developer/extensions/webRequest.html)` 则必须指定。`