'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electron = require('electron');

var _Constants = require('../Constants');

var Constants = _interopRequireWildcard(_Constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const { MenuEvents } = Constants;
const SEPARATOR = { type: 'separator' };

exports.default = [{
  label: '&File',
  submenu: [{
    label: '&Options',
    click: () => _electron.app.emit(MenuEvents.OPEN_SETTINGS),
    accelerator: 'Ctrl+,'
  }, SEPARATOR, {
    label: '&Exit',
    click: () => _electron.app.quit(),
    accelerator: 'Alt+F4'
  }]
}, {
  label: '&View',
  submenu: [{
    label: '&Reload',
    click: () => _electron.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache(),
    accelerator: 'Control+R'
  }, {
    label: 'Toggle &Full Screen',
    click: () => _electron.BrowserWindow.getFocusedWindow().setFullScreen(!_electron.BrowserWindow.getFocusedWindow().isFullScreen()),
    accelerator: 'Control+Shift+F'
  }, SEPARATOR, {
    label: '&Developer',
    submenu: [{
      label: 'Toggle Developer &Tools',
      click: () => _electron.BrowserWindow.getFocusedWindow().toggleDevTools(),
      accelerator: 'Control+Shift+I'
    }]
  }]
}, {
  label: '&Help',
  submenu: [{
    label: 'Check for Updates',
    click: () => _electron.app.emit(MenuEvents.CHECK_FOR_UPDATES)
  }, SEPARATOR, {
    label: 'Lightcord Help',
    click: () => _electron.app.emit(MenuEvents.OPEN_HELP)
  }]
}];
module.exports = exports.default;