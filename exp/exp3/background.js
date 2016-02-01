'use strict';
let cb = chrome.browserAction,cc = chrome.cookies;
cb.onClicked.addListener(function () {
    // cc.getAll({},function(cookies){
    //     console.log(cookies[0])
    // })
    cc.getAllCookieStores(function(cs){
        console.log(cs);
    });
});