const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let backendProcess;
let isDev = false;

const logFilePath = path.join(app.getPath('userData'), 'main-process.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Redirect console logs
console.log = (...args) => {
  logStream.write(`[LOG] ${new Date().toISOString()} ${args.join(' ')}\n`);
  process.stdout.write(`[LOG] ${new Date().toISOString()} ${args.join(' ')}\n`);
};

console.error = (...args) => {
  logStream.write(`[ERROR] ${new Date().toISOString()} ${args.join(' ')}\n`);
  process.stderr.write(`[ERROR] ${new Date().toISOString()} ${args.join(' ')}\n`);
};

// Log app start
console.log("Electron app started");

async function createWindow() {
  isDev = await import('electron-is-dev').then((mod) => mod.default);

  mainWindow = new BrowserWindow({ 
    width: 1200, 
    height: 900,
    minWidth: 900,
    minHeight: 700,
    icon: path.join(__dirname, 'public/icon.ico'),
   });
   
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  console.log('isDev:', isDev);
  console.log('Load URL:', isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`);

  mainWindow.on('closed', () => (mainWindow = null));
}

function startBackend() {
  const backendPath = isDev
    ? path.join(__dirname, "../backend/server.js")
    : path.join(process.resourcesPath, "output-folder/backend/server.js");

  const logFile = path.join(app.getPath("userData"), "backend.log");

  console.log("Backend log file:", logFile);

  try {
    backendProcess = spawn("node", [backendPath], {
      shell: true,
    });

    // Pipe backend process output to the log file
    const logStream = fs.createWriteStream(logFile, { flags: "a" });

    backendProcess.stdout.pipe(logStream);
    backendProcess.stderr.pipe(logStream);

    backendProcess.on("error", (err) => {
      console.error("Failed to start subprocess:", err);
      fs.appendFileSync(logFile, `Failed to start subprocess: ${err.message}\n`);
    });

    backendProcess.on("exit", (code) => {
      const exitMessage = `Backend process exited with code ${code}\n`;
      console.log(exitMessage);
      fs.appendFileSync(logFile, exitMessage);
    });
  } catch (error) {
    console.error("Failed to start backend process.", error);
    fs.appendFileSync(logFile, `Failed to start backend process: ${error.message}\n`);
  }
}




app.on('ready', () => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    startBackend();
    createWindow();
  }
});
