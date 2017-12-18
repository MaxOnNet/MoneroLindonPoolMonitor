'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var mainWindow = null;
app.on('ready', function() {
	mainWindow = new BrowserWindow({
		'frame': false,
		'min-height': 646,
		'min-width': 840,
		'resizable': true
	});
	mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
	mainWindow.setMenu(null);
});

app.on('close-main-window', function () {
	app.quit();
});