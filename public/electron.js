const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

async function createWindow() {
  const isDev = await import('electron-is-dev').then((mod) => mod.default);

  mainWindow = new BrowserWindow({ 
    width: 1200, 
    height: 900,
    minWidth: 900,
    minHeight: 800,
    icon: path.join(__dirname, 'public/icon.ico'),
   });
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  mainWindow.on('closed', () => (mainWindow = null));
}

console.log('relative path: ', path.join(__dirname, '../build/index.html'));

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
