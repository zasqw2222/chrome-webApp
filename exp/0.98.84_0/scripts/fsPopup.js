var capMode;
var clickedElem;


function enableToolsItems() {
    var fTabsMode = (capMode === cModeTabs),
        fProMode = getExtension().isProMode(),
        showIfTabs = fTabsMode? "block" : "none",
        showIfNotTabs = !fTabsMode ? "block" : "none",
        enabledIfPro = fProMode ? "" : "disabled",
        disabledIfNotPro = !fProMode && fTabsMode ? "disabled" : "";


    document.getElementById("mnuTabsUpgrade").style.display = fProMode || !fTabsMode ? "none" : "block";

    document.getElementById("mnuSaveSinglePDF").style.display = showIfTabs;
    //document.getElementById("mnuClipboard").style.display = showIfNotTabs;
    document.getElementById("mnuSavePDF").style.display = showIfNotTabs;

    document.getElementById("mnuEdit").className = disabledIfNotPro;
    document.getElementById("mnuSave").className = disabledIfNotPro;
    document.getElementById("mnuUpload").className = disabledIfNotPro;
    document.getElementById("mnuPrint").className = disabledIfNotPro;
    document.getElementById("mnuClipboard").className = disabledIfNotPro;
    document.getElementById("mnuEmail").className = disabledIfNotPro;
    document.getElementById("mnuExtEdit").className = disabledIfNotPro;
    document.getElementById("mnuSendOneNote").className = disabledIfNotPro;
    document.getElementById("mnuSaveSinglePDF").className = disabledIfNotPro;

}

function switchPane(evt, id)
{
	var menu2 = document.getElementById(id);
	menu2.style.display = "block";
	menu2.style.right = "5px"; 
	menu2.style.top = Math.min(document.body.clientHeight - menu2.clientHeight - 5, evt.pageY) + "px"; 
}

function updateLastAction()
{
	var txt = getExtension().getLADescription();
	
	document.getElementById("spnLastAction").innerHTML = txt;
	document.getElementById("spnLastAction").title = txt + " (" + getOption(cShortcutPref, cDefaultShortcut) + ")";
	document.getElementById("spnShortcut").innerHTML = getOption(cShortcutPref, cDefaultShortcut);
	document.getElementById("spnShortcutVisible").innerHTML = getOption(cShortcutPrefVisible, cDefaultShortcutVisible);
	document.getElementById("spnShortcutEntire").innerHTML = getOption(cShortcutPrefEntire, cDefaultShortcutEntire);
	document.getElementById("spnShortcutSelection").innerHTML = getOption(cShortcutPrefSelection, cDefaultShortcutSelection);
}

function click(obj, evt)
{
	if (obj.className == "disabled") return;
	
	clickedElem = obj;
	
	if (obj.id != "mnuCaptureEntire" && obj.id != "mnuCaptureVisible" && obj.id != "mnuCaptureSelection" && obj.id != "mnuCaptureBrowser" && obj.id != "mnuCaptureTabs" && obj.id != "mnuMiscellaneousFolder")
		window.close();
		
	var ext = getExtension();
		
	switch (obj.id)
	{
		case "mnuResume"			: ext.resumeEditing(); break;
		case "mnuPreferences"		: 
		case "mnuPreferencesLite"	:
									  ext.openExtensionPreferences(); break;
		case "mnuQuickLaunch"		: ext.captureLastUsedMode(); break;
		//case "mnuQuickLaunch"	: ext.openCaptureSettings(); break;
		
		case "mnuCaptureEntire"		: capMode = cModeEntire; enableToolsItems(); switchPane(evt, "mnuTools"); break;
		case "mnuCaptureVisible"	: capMode = cModeVisible; enableToolsItems(); switchPane(evt, "mnuTools"); break;
		case "mnuCaptureSelection"	: capMode = cModeSelected; enableToolsItems(); switchPane(evt, "mnuTools"); break;
		case "mnuCaptureBrowser"	: capMode = cModeBrowser; enableToolsItems(); switchPane(evt, "mnuTools"); break;
        case "mnuCaptureTabs"	    : capMode = cModeTabs; enableToolsItems(); switchPane(evt, "mnuTools"); break;

		case "mnuMiscellaneousFolder"	:  switchPane(evt, "mnuMiscellaneous"); break;
		
		case "mnuViewDemo"			: ext.openDemoPage(); break;
		case "mnuSupport"			: ext.openSupportPage(); break;
		case "mnuAPI"				: ext.openAPIPage(); break;

        case "mnuTabsUpgrade"       :
        case "mnuUpgrade"			: ext.doUpgrade(); break;

		case "mnuRegister"			: ext.doRegister(); break;
		case "mnuEnterLicense"		: ext.enterLicense(); break;
		
		case "mnuCaptureEntireLite"		: ext.executeGrabber(cActionEdit ,cModeEntire); break;
		case "mnuCaptureVisibleLite"	: ext.executeGrabber(cActionEdit ,cModeVisible); break;
		case "mnuCaptureSelectionLite"	: ext.executeGrabber(cActionEdit ,cModeSelected); break;//自定义范围截图 参数1 0 参数2 2
		
		case "mnuEdit"				: ext.executeGrabber(cActionEdit ,capMode); break;
		case "mnuSave"				: ext.executeGrabber(cActionSave ,capMode); break;
		case "mnuSavePDF"			: ext.executeGrabber(cActionSavePDF ,capMode); break;
        case "mnuSaveSinglePDF"		: ext.executeGrabber(cActionMultiPDF ,capMode); break;
		case "mnuUpload"			: ext.executeGrabber(cActionUpload ,capMode); break;
		case "mnuPrint"				: ext.executeGrabber(cActionPrint ,capMode); break;
		case "mnuClipboard"			: ext.executeGrabber(cActionClipboard ,capMode); break;
		case "mnuEmail"				: ext.executeGrabber(cActionEMail ,capMode); break;
		case "mnuExtEdit"			: ext.executeGrabber(cActionPaint ,capMode); break;
		case "mnuSendOneNote"		: ext.executeGrabber(cActionSendOneNote, capMode); break;
		case "mnuOpenFile"			: ext.openFile(); break;
		case "mnuOpenClipboard"		: ext.openClipboard(); break;
		case "mnuLicenseInfo"		: ext.showLicenseInfo(); break;
		case "mnuAbout"				: ext.showAbout(); break;
		case "mnuFireShotNative"	: ext.installNative(); break;
	}	
}

function mouseOver(obj, evt)
{
	if (obj != clickedElem && (!obj.parentNode || obj.parentNode.getAttribute('rel') != "mnuTools"))
		document.getElementById("mnuTools").style.display = "none";
		
    if (obj != clickedElem && (!obj.parentNode || obj.parentNode.getAttribute('rel') != "mnuMiscellaneous"))
        document.getElementById("mnuMiscellaneous").style.display = "none";
		
}

function load()
{
	try
	{
		i18nPrepare();
	} 
	catch (e) {logError(e.message);}
	
	var itr = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false);
	var currentNode;  
   
	while (currentNode = itr.nextNode()) 
	{  
   		if (currentNode.nodeName == "LI")
		{
			currentNode.onclick = function(evt){evt.preventDefault(); click(this, evt); return true;};
			currentNode.onmouseover = function(evt){mouseOver(this, evt);};
		}
	} 
	
	updateLastAction();
	updateAccessibility();
}

function updateAccessibility()
{
	getExtension().getMenuSettings(function (settings)	{
		for(var key in settings)
		{
			var elem = document.getElementById(key);
			if (elem == undefined) alert("Element " + key + " not found");
			else
			{
				switch (settings[key])
				{
					case "visible"	: elem.style.display = "block"; break;
					case "hidden"	: elem.style.display = "none"; break;
					case "disabled"	: elem.className = "disabled"; break;
					case "enabled"	: elem.className = ""; break;
				}
				
			}
		}
		
		//document.getElementById("mnuMain").style.display = "block";
	});
}

document.addEventListener('DOMContentLoaded', function () {
	if (getExtension().checkBadgeAction()) 
	{
		window.close();
		return;
	}
	else
		load();
});

