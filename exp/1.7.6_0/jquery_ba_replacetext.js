/*!
 * jQuery replaceText - v1.1 - 11/21/2009
 * http://benalman.com/projects/jquery-replacetext-plugin/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 *
 * Adapted by Laurent Van Winckel for Clickable Links, anno 2012.
 */
(function($){$.fn.replaceText=function(c,b,e){var d=0;var a=this.each(function(){var i=this.firstChild,j,g,f=[];var h=["a","head","noscript","option","script","style","title","textarea","pre","xmp","input","code"];if(i&&$.inArray(this.nodeName.toLowerCase(),h)==-1){do{if(d<8&&i.nodeType===3){j=i.nodeValue;g=j.replace(c,b);if(g!==j){if(!e&&/</.test(g)){$(i).before(g);f.push(i);$(i).parent().find("a.skylink").each(function(){this.onclick=function(){chrome.runtime.sendMessage({what:"_trackEvent",category:chrome.runtime.id,action:"clickTextLink",label:location.host})}})}else{i.nodeValue=g;console.log("addLink 2");i.onclick=function(){chrome.runtime.sendMessage({what:"_trackEvent",category:chrome.runtime.id,action:"clickTextLink",label:location.host})}}d++;if(d>=8){f.length&&$(f).remove();f=[];return false}}}}while(i=i.nextSibling)}f.length&&$(f).remove();f=[]});if(d>0){chrome.runtime.sendMessage({what:"_trackEvent",category:chrome.runtime.id,action:"addLink",label:d+"_"+location.host})}return a}})(jQuery);