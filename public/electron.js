const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let mainWindow;
let backendProcess;
let isDev = false;

const logFilePath = path.join(app.getPath("userData"), "main-process.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Redirect console logs to file and terminal
console.log = (...args) => {
  logStream.write(`[LOG] ${new Date().toISOString()} ${args.join(" ")}\n`);
  process.stdout.write(`[LOG] ${new Date().toISOString()} ${args.join(" ")}\n`);
};

console.error = (...args) => {
  logStream.write(`[ERROR] ${new Date().toISOString()} ${args.join(" ")}\n`);
  process.stderr.write(`[ERROR] ${new Date().toISOString()} ${args.join(" ")}\n`);
};

// Log app start
console.log("🚀 Electron app started");

async function createWindow() {
  isDev = await import("electron-is-dev").then((mod) => mod.default);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 900,
    minHeight: 700,
    icon: path.join(__dirname, "public/icon.ico"),
  });

  const appURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(appURL);

  console.log("🛠️  isDev:", isDev);
  console.log("🌍 Loading URL:", appURL);

  mainWindow.on("closed", () => (mainWindow = null));
}

function startBackend() {
  const devBackendPath = path.join(__dirname, "backend", "localbackend.js");
  const prodBackendPath = path.join(process.resourcesPath, "backend", "localbackend.js");

  const backendPath = isDev ? devBackendPath : prodBackendPath;

  console.log("📂 Backend Path:", backendPath);

  if (!fs.existsSync(backendPath)) {
    console.error("❌ Backend file does not exist:", backendPath);
    return;
  }

  try {
    backendProcess = spawn("node", [backendPath], {
      detached: true,       // Run process independently
      windowsHide: true,    // Hide the terminal window
      stdio: "ignore"       // Ignore output so it doesn't trigger a new terminal
    });

    backendProcess.unref(); // Fully detach the process
  } catch (error) {
    console.error("❌ Failed to start backend process.", error);
  }
}



app.on("ready", () => {
  startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    startBackend();
    createWindow();
  }
});
