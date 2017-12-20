const electron = require('electron')
const {app, Menu, shell} = require('electron')
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createMenu() {
	var menu_template = [{
		label: app.getName(),
		submenu: [
	      {role: 'about'},
	      {type: 'separator'},
	      {role: 'services', submenu: []},
	      {type: 'separator'},
	      {role: 'hide'},
	      {role: 'hideothers'},
	      {role: 'unhide'},
	      {type: 'separator'},
	      {role: 'quit'}
    ]},
	{
	    label: 'Edit',
	    submenu: [
	      {
	        label: 'Cut',
	        accelerator: 'Command+X',
	        selector: 'cut:'
	      },
	      {
	        label: 'Copy',
	        accelerator: 'Command+C',
	        selector: 'copy:'
	      },
	      {
	        label: 'Paste',
	        accelerator: 'Command+V',
	        selector: 'paste:'
	      },
	      {
	        label: 'Select All',
	        accelerator: 'Command+A',
	        selector: 'selectAll:'
	      },
	    ]
	  },
	  {
	    label: 'Window',
	    submenu: [
	      {
	        label: 'Minimize',
	        accelerator: 'Command+M',
	        selector: 'performMiniaturize:'
	      },
	      {
	        label: 'Close',
	        accelerator: 'Command+W',
	        selector: 'performClose:'
	      },
	      {
	        type: 'separator'
	      },
	      {
	        label: 'Bring All to Front',
	        selector: 'arrangeInFront:'
	      },
	    ]
	}];

	Menu.setApplicationMenu(Menu.buildFromTemplate(menu_template));
}

function createWindow () {
  mainWindow = new BrowserWindow({minWidth: 800, minHeight: 600, frame: false, resizable: true, fullscreenable: true})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', function () {
	if (process.platform === 'darwin') {
		createMenu()
	}
	createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})