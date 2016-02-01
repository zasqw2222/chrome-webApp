'use strcit';
var cb = chrome.browserAction, ct = chrome.tabs

// 用Baction打开新标签
// cb.onClicked.addListener(function () {
//     // chrome.tabs.create(function(tab){})
//     ct.create({}, function (tab) {
//         console.log(tab);
//         /**
//          * active: true
//            audible: false
//            height: 1241
//            highlighted: true
//            id: 620
//            incognito: false
//            index: 9
//            mutedInfo: Object
//            pinned: false
//            selected: true
//            status: "loading"
//            title: "打开新的标签页"
//            url: "chrome://newtab/"
//            width: 1720
//            windowId: 1
//          */
//         cb.getTitle({tabId:tab.id},function(title){
//             alert(title);
//         })
//     });
// })

// 修改浏览器按钮标题
cb.onClicked.addListener(function(){
    cb.setTitle({
        title : "牛逼的技能"
    })
})