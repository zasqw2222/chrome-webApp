'use strict';
var cb = chrome.browserAction,cw = chrome.windows;
cb.onClicked.addListener(function(){
    cw.create({});
});