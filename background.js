chrome.runtime.onInstalled.addListener(function() {

	chrome.contextMenus.create({ 
		id: "RaspagemFL", 
		title: "Raspar tabela", 
		type: "normal", 
		contexts: ["page"],
		"documentUrlPatterns": ["*://studio.youtube.com/*/monetization/memberships"]

	});	
});


chrome.contextMenus.onClicked.addListener(function(item, tab) {
		"use strict";
		if(item.menuItemId == "RaspagemFL"){	
			chrome.tabs.executeScript(tab.id, {code: "btnDireitoRaspar = true;", allFrames:true}, function() { chrome.tabs.executeScript(tab.id, {file: "raspagem.js", allFrames:true});});			
		}	
});
