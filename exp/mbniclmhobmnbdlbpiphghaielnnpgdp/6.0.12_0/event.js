window._gaq = window._gaq || [];
var f = {G:function(a) {
  return a + Math.random();
}, Z:function(a) {
  for (var b = a.length, c, d;0 !== b;) {
    d = Math.floor(Math.random() * b), b -= 1, c = a[b], a[b] = a[d], a[d] = c;
  }
  return a;
}, U:function(a, b) {
  return Math.floor(Math.random() * (b - a + 1) + a);
}}, g = {extend:function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.q = b.prototype;
}}, h = {Y:function(a, b, c) {
  var d = f.G(a);
  a = {};
  a[d] = b;
  chrome.storage.local.set(a, function() {
    c && c(d);
  });
}, X:function(a, b) {
  chrome.storage.local.get(a, function(c) {
    chrome.storage.local.remove(a, function() {
      b && b(c[a]);
    });
  });
}, Q:function() {
  return parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
}}, l = {e:function(a) {
  return chrome.i18n.getMessage(a);
}};
function Notification(a) {
  this.a = a;
  this.i = null;
}
function m(a) {
  m.q.constructor.apply(this, arguments);
  this.create();
}
g.extend(m, Notification);
m.prototype.create = function() {
  var a = this;
  chrome.notifications.create(this.a, {type:"progress", title:"Lightshot", message:l.e("screenshot_plugin_uploading_window_capt"), iconUrl:"img/icon256.png", buttons:[{title:l.e("screenshot_plugin_cancel")}], progress:0}, function() {
    a.i = "uploading";
  });
};
m.prototype.update = function(a) {
  var b = this;
  "progress" === a.type && a.progress ? chrome.notifications.update(this.a, {progress:a.progress}, function() {
  }) : "success" === a.type && a.message ? (a = {type:"basic", message:a.message, buttons:[{title:l.e("screenshot_plugin_copy")}, {title:l.e("screenshot_plugin_open")}]}, chrome.notifications.update(this.a, a, function() {
    b.i = "success";
  })) : "failed" === a.type && (a = {type:"basic", message:l.e("screenshot_plugin_upload_failed_retry"), buttons:[{title:l.e("screenshot_plugin_retry")}, {title:l.e("screenshot_plugin_cancel")}]}, chrome.notifications.update(this.a, a, function() {
    b.i = "failed";
  }));
};
function r() {
  function a(a) {
    chrome.notifications.clear(a, function() {
    });
    delete b[a];
  }
  var b = {};
  chrome.notifications.onClicked.addListener(function(a) {
    a = b[a];
    "success" === a.i && chrome.runtime.sendMessage({name:t, id:a.a});
  });
  chrome.notifications.onButtonClicked.addListener(function(a, d) {
    var e = b[a];
    "uploading" === e.i && 0 === d ? chrome.runtime.sendMessage({name:w, id:e.a}) : "success" === e.i ? 0 === d ? chrome.runtime.sendMessage({name:x, id:e.a}) : 1 === d && chrome.runtime.sendMessage({name:t, id:e.a}) : "failed" === e.i && (0 === d ? chrome.runtime.sendMessage({name:y, id:e.a}) : 1 === d && chrome.runtime.sendMessage({name:w, id:e.a}));
  });
  return{N:function(c) {
    a(c);
    b[c] = new m(c);
  }, B:function(a, d) {
    b[a].update(d);
  }, O:a};
}
;var z = {save:function(a, b) {
  a && "undefined" != typeof a && "undefined" != typeof a.img_url && $.ajax({type:"POST", url:"https://api.prntscr.com/v1/", data:JSON.stringify({jsonrpc:"2.0", id:1, method:"save", params:a}), dataType:"json", beforeSend:function(a) {
    a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }, complete:function(a) {
    a.responseJSON && "undefined" != typeof a.responseJSON && "undefined" != typeof a.responseJSON.result ? b(a.responseJSON.result) : b(null);
  }});
}};
function A(a, b) {
  this.a = a;
  this.j = b;
  this.J = this.p = this.b = this.t = null;
  this.g = {};
  this.g[this.f.m] = $.Callbacks();
  this.g[this.f.l] = $.Callbacks();
}
A.prototype.f = {m:"progress_change", l:"complete"};
A.prototype.n = {D:"success", C:"failed"};
A.prototype.s = function() {
  var a = {V:this.p};
  this.b ? a.error = this.b : a.A = this.J;
  return a;
};
A.prototype.attachEvent = function(a, b) {
  "undefined" !== typeof this.g[a] && this.g[a].add(b);
};
A.prototype.detachEvent = function(a, b) {
  "undefined" !== typeof this.g[a] && this.g[a].remove(b);
};
function B(a, b, c) {
  B.q.constructor.call(this, a, b);
  this.k = c;
  this.K = "https://api.imgur.com/3/upload.json";
}
g.extend(B, A);
B.r = "f705f76c81bce12 b4e63420b1461ce 15852baf7d723e5 3df225a9b03b89a 36e07290900869a 905dd4ad0ebc216".split(" ");
B.prototype.upload = function() {
  var a = this;
  this.p = this.n.C;
  this.t = $.ajax({url:a.K, type:"POST", timeout:18E4, data:"image=" + encodeURIComponent(a.j.dataUrl.replace(/^data:image\/(png|jpg);base64,/, "")), xhr:function() {
    var b = new XMLHttpRequest;
    b.upload.onprogress = function(b) {
      b.lengthComputable && a.g[a.f.m].fire({loaded:b.loaded, total:b.total});
    };
    return b;
  }, beforeSend:function(b) {
    a.F(b);
  }, complete:function(b, c) {
    a.p = a.n.C;
    try {
      var d = JSON.parse(b.responseText);
      if (d && d.data && d.data.link) {
        a.p = a.n.D;
        var e = {};
        d && d.data && (d.data.link && (e.img_url = d.data.link), d.data.width && (e.width = d.data.width), d.data.height && (e.height = d.data.height), d.data.P && (e.delete_hash = d.data.P));
        a.J = e;
      } else {
        a.b = l.e("screenshot_plugin_image_hosting_incorrect_response");
      }
    } catch (s) {
      a.b = l.e("screenshot_plugin_upload_error_capt") + "\n\n", a.b += l.e("screenshot_plugin_upload_error_detailed_info") + ":\n", a.b += "status = " + (b && b.status ? b.status : "") + "\n", a.b += "textStatus = " + c + "\n", a.b += "e = " + s + "\n", a.b += "responseText = " + (b && b.responseText ? b.responseText : "") + "\n";
    }
    a.g[a.f.l].fire(a.s());
  }});
};
B.prototype.F = function(a) {
  a.setRequestHeader("Authorization", "Client-ID " + (this.k || "f705f76c81bce12"));
};
B.prototype.cancel = function() {
  this.t && this.t.abort();
};
B.prototype.s = function() {
  var a = B.q.s.apply(this, arguments);
  a.key = this.k.substr(this.k.length - 4);
  return a;
};
function C(a, b, c) {
  C.q.constructor.call(this, a, b, c.L);
  this.k = c.L;
  this.S = c.T;
  this.K = "https://imgur-apiv3.p.mashape.com/3/image";
}
g.extend(C, B);
C.r = {M:{L:"095eb04c751288e", T:"wiA790BrM4mshOWa0tVKevgLVJGzp1pGpXGjsnae0ExrxINhs2"}};
C.prototype.F = function(a) {
  a.setRequestHeader("Authorization", "Client-ID " + this.k);
  a.setRequestHeader("X-Mashape-Key", this.S);
};
function D(a, b) {
  this.a = a;
  this.j = b;
  var c = this;
  this.o = [];
  this.o.push(function() {
    return new B(c.a, c.j, B.r[f.U(0, 5)]);
  });
  this.o.push(function() {
    return new C(c.a, c.j, C.r.M);
  });
  this.u = 0;
  this.v = this.w = this.I = this.H = this.c = null;
}
function E(a) {
  a.w = function(b) {
    F(a, b);
  };
  a.c.attachEvent(a.c.f.l, a.w);
  a.v = function(b) {
    chrome.runtime.sendMessage({name:G, id:a.a, progress:Math.round(b.loaded / b.total * 100)});
  };
  a.c.attachEvent(a.c.f.m, a.v);
}
function H(a) {
  a.c.detachEvent(a.c.f.l, a.w);
  a.c.detachEvent(a.c.f.m, a.v);
}
D.prototype.upload = function() {
  this.c = this.o[this.u]();
  E(this);
  I.d("upload", "hosting", "attempt");
  this.c.upload();
};
function F(a, b) {
  b.V === a.c.n.D ? (a.H = b.A.img_url, a.j.cmdAfterUpload === J ? chrome.runtime.sendMessage({name:M, id:a.a}) : (b.A.dpr = a.j.dpr, I.d("upload", "prntscr", "attempt"), z.save(b.A, function(b) {
    b && b.success && b.url ? (a.I = b.url, I.d("upload", "prntscr", "success")) : I.d("upload", "prntscr", "fail");
    chrome.runtime.sendMessage({name:M, id:a.a});
    I.d("upload", "prntscr", "finished");
  })), I.d("upload", "hosting", "success_" + b.key)) : (I.d("upload", "hosting", "fail_" + b.key), N(a));
  I.d("upload", "hosting", "finished");
}
function N(a) {
  a.u++;
  a.u < a.o.length ? (H(a), a.c = null, a.upload()) : (chrome.runtime.sendMessage({name:O, id:a.a}), I.d("upload", "totalfail"));
}
D.prototype.cancel = function() {
  this.c.cancel();
  H(this);
  I.d("upload", "cancel");
};
function P() {
  this.h = {};
}
P.prototype.upload = function(a, b) {
  this.h[a] = new D(a, b);
  this.h[a].upload();
  chrome.runtime.sendMessage({name:Q, id:a});
  I.d("upload", "attempt");
};
function R(a, b) {
  var c;
  a.h[b] ? (c = a.h[b], c = c.I || c.H) : c = null;
  return c;
}
;var y = "upload_screenshot", Q = "upload_started", G = "upload_progress", M = "upload_success", O = "upload_failed", t = "open_screenshot_link", x = "copy_screenshot_link", w = "cancel_upload", J = "search_google";
var I = function(a) {
  (function() {
    window._gaq.push(["_setAccount", a]);
    window._gaq.push(["_trackPageview"]);
    var b = document.createElement("script");
    b.type = "text/javascript";
    b.async = !0;
    b.src = "https://ssl.google-analytics.com/ga.js";
    var c = document.getElementsByTagName("script")[0];
    c.parentNode.insertBefore(b, c);
  })();
  return{d:function(a, c, d, e, s) {
    window._gaq.push(["_trackEvent", a, c, d, e, s]);
  }};
}("UA-53060756-1");
(function() {
  function a(a) {
    a.clipboardData.setData("text/plain", K);
    a.preventDefault();
  }
  function b(a, b, L) {
    if (a && "undefined" !== typeof a && "undefined" !== typeof a.name) {
      switch(a.name) {
        case "load_screenshot":
          L(S(a.id));
          break;
        case y:
          e(a.id);
          L();
          break;
        case Q:
          n.N(a.id);
          break;
        case G:
          n.B(a.id, {type:"progress", progress:a.progress});
          break;
        case M:
          c(a.id);
          break;
        case O:
          n.B(a.id, {type:"failed"});
          break;
        case t:
          chrome.tabs.create({url:R(k, a.id)});
          break;
        case x:
          K = R(k, a.id);
          document.execCommand("copy");
          break;
        case w:
          d(a.id, function() {
            var b = k, c = a.id;
            b.h[c] && (b.h[c].cancel(), delete b.h[c]);
          });
      }
    }
  }
  function c(a) {
    d(a, function() {
      if (u[a] && u[a].cmdAfterUpload) {
        var b = R(k, a);
        switch(u[a].cmdAfterUpload) {
          case J:
            chrome.tabs.create({url:"http://www.google.com/searchbyimage?image_url=" + b});
            break;
          case "share_twitter":
            chrome.tabs.create({url:"http://twitter.com/home?source=Lightshot&status=" + b + "%20"});
            break;
          case "share_facebook":
            chrome.tabs.create({url:"https://www.facebook.com/dialog/share?app_id=585941498129307&display=page&href=" + b + "&redirect_uri=" + b});
            break;
          case "share_vk":
            chrome.tabs.create({url:"http://vk.com/share.php?url=" + b});
            break;
          case "share_pinterest":
            chrome.tabs.create({url:"http://pinterest.com/pin/create/button/?url=" + b + "&media=" + b + "/direct"});
        }
        n.O(a);
      } else {
        n.B(a, {type:"success", message:R(k, a)});
      }
    });
  }
  function d(a, b) {
    chrome.storage.local.remove(a, function() {
      b && b();
    });
  }
  function e(a) {
    chrome.storage.local.get(a, function(b) {
      b = b[a];
      u[a] = b;
      k.upload(a, b);
    });
  }
  function s(a) {
    alert(T)
    T(a);
  }
  function S(a) {
    var b = "";
    void 0 !== typeof v[a] && (b = v[a], delete v[a]);
    return b;
  }
  function T(a) {
    U(a, function(a) {
      var b = f.G("screenshot_");
      v[b] = a;
      chrome.tabs.create({url:chrome.extension.getURL("screenshot.html?id=" + b)}, function(a) {
        if ("function" == typeof chrome.tabs.W) {
          try {
            chrome.tabs.W(a.id, 1);
          } catch (b) {
          }
        }
      });
    });
  }
  function U(a, b) {
    var c = h.Q();
    1 == window.devicePixelRatio || 38 != c && 39 != c ? chrome.tabs.captureVisibleTab({format:"png"}, function(a) {
      b(a);
    }) : V(a, b);
  }
  function V(a, b) {
    var c = a.width, d = a.height;
    alert(c)
    1 != window.devicePixelRatio && (c = Math.floor(a.width * window.devicePixelRatio), d = Math.floor(a.height * window.devicePixelRatio));
    chrome.tabCapture.capture({video:!0, audio:!1, videoConstraints:{mandatory:{minWidth:c, minHeight:d, maxWidth:c, maxHeight:d}}}, function(a) {
      if (a) {
        var e = document.createElement("video");
        e.onloadedmetadata = function() {
          var q = document.createElement("canvas");
          q.width = c;
          q.height = d;
          var k = q.getContext("2d");
          e.play();
          k.drawImage(e, 0, 0);
          e.pause();
          e.src = "";
          a.stop();
          q = q.toDataURL("image/png");
          b(q);
        };
        e.src = window.URL.createObjectURL(a);
      } else {
        chrome.tabs.captureVisibleTab({format:"png"}, function(a) {
          b(a);
        });
      }
    });
  }
  var k = null, n = null, K = null, u = {}, v = {};
  return{R:function() {
    k = new P;
    n = r();
    chrome.browserAction.onClicked.addListener(s);
    chrome.runtime.onMessage.addListener(b);
    document.addEventListener("copy", a);
    var c = chrome.runtime.getManifest().version;
    "undefined" === typeof localStorage.lightshot_version ? localStorage.ever_updated = "no" : localStorage.lightshot_version != c && (localStorage.ever_updated = "yes");
    localStorage.lightshot_version = c;
  }};
})().R();

