'use strict';
var cb = chrome.browserAction;
cb.onClicked.addListener(function(){
    console.log(window.webkitNotifications)
    // var notification = webkitNotifications.createNotification('icon38.png','您好','这是通知内容');
    var notification = window.webkitNotifications.createNotification('icon38.png','您好','这是通知内容');
    notification.show();
});