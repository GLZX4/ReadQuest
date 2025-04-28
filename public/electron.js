const { app, BrowserWindow, dialog } = require("electron");
const { fork } = require('child_process');
const path = require("path");
const checkDiskSpace = require("check-disk-space").default;
const fs = require("fs");
const os = require('os');
const dns = require('dns');

const MIN_REQUIRED_SPACE_GB = 1;
const MIN_RAM_GB = 2; // Minimum required RAM in GB
const MIN_CPU_CORES = 2; // Minimum number of CPU cores

let mainWindow;
let backendProcess;
let isDev = false;

const logFilePath = path.join(app.getPath("userData"), "main-process.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

console.log = (...args) => {
  logStream.write(`[LOG] ${new Date().toISOString()} ${args.join(" ")}\n`);
  process.stdout.write(`[LOG] ${new Date().toISOString()} ${args.join(" ")}\n`);
};

console.error = (...args) => {
  logStream.write(`[ERROR] ${new Date().toISOString()} ${args.join(" ")}\n`);
  process.stderr.write(`[ERROR] ${new Date().toISOString()} ${args.join(" ")}\n`);
};

// Log app start
console.log("Electron app started");

async function createWindow() {
  isDev = await import("electron-is-dev").then((mod) => mod.default);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 900,
    minHeight: 700,
    icon: path.join(__dirname, "public/icon.ico"),
    webPreferences: {
      devTools: isDev
    }
  });
  
  // Hide the menubar
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAutoHideMenuBar(true);
  

  const appURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(appURL);

  console.log(" isDev:", isDev);
  console.log(" Loading URL:", appURL);

  mainWindow.on("closed", () => (mainWindow = null));
}

function startBackend() {
  const devBackendPath = path.join(__dirname, "..", "backend", "localbackend.js");
  const prodBackendPath = path.join(process.resourcesPath, "backend", "localbackend.js");

  const backendPath = app.isPackaged ? prodBackendPath : devBackendPath;

  console.log("Backend Path:", backendPath);

  if (!fs.existsSync(backendPath)) {
    console.error("Backend file does not exist:", backendPath);
    return;
  }

  try {
    backendProcess = fork(backendPath, {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });
    
    backendProcess.stdout?.on('data', (data) => {
      console.log(`[BACKEND] ${data.toString().trim()}`);
    });
    
    backendProcess.stderr?.on('data', (data) => {
      console.error(`[BACKEND ERROR] ${data.toString().trim()}`);
    });
    
    backendProcess.on('exit', (code, signal) => {
      console.error(`[BACKEND EXIT] code=${code} signal=${signal}`);
    });
    
    backendProcess.on('error', (err) => {
      console.error(`[BACKEND PROCESS ERROR]`, err);
    });
    
  } catch (error) {
    console.error("Failed to start backend process.", error);
  }
}



// code below adapted from: https://gist.github.com/sunmeat/798c13df42dde2af9648ff19eac8a639
async function checkStorageBeforeLaunch() {
  try {
      const diskSpace = await checkDiskSpace('C:/');
      const freeSpaceGB = diskSpace.free / 1024 / 1024 / 1024;

      console.log(`Free space on C: ${freeSpaceGB.toFixed(2)} GB`);

      if (freeSpaceGB < MIN_REQUIRED_SPACE_GB) {
          dialog.showErrorBox(
              "Not Enough Disk Space",
              `Installation requires at least ${MIN_REQUIRED_SPACE_GB} GB of free space.\n\nAvailable: ${freeSpaceGB.toFixed(2)} GB`
          );
          app.quit();
          return false; 
      }
      
      return true; 
  } catch (error) {
      console.error("Error checking disk space:", error);
      return true; 
  }
}

function checkWritePermissions(directory) {
  try {
      fs.accessSync(directory, fs.constants.W_OK);
      console.log(`Write permission granted for: ${directory}`);
      return true;
  } catch (err) {
      console.error(`No write permission for: ${directory}`);
      dialog.showErrorBox(
          "Permission Denied",
          `ReadQuest does not have write access to ${directory}. Try running as administrator.`
      );
      return false;
  }
}

function checkSystemResources() {
    const totalRAM = os.totalmem() / (1024 * 1024 * 1024); // Convert bytes to GB
    const cpuCores = os.cpus().length;

    console.log(`CPU Cores: ${cpuCores}`);
    console.log(`Total RAM: ${totalRAM.toFixed(2)} GB`);

    if (totalRAM < MIN_RAM_GB) {
        dialog.showErrorBox(
            "Insufficient RAM",
            `ReadQuest requires at least ${MIN_RAM_GB}GB RAM. Your system has ${totalRAM.toFixed(2)}GB.`
        );
        return false;
    }

    if (cpuCores < MIN_CPU_CORES) {
        dialog.showErrorBox(
            "Insufficient CPU",
            `ReadQuest requires at least ${MIN_CPU_CORES} CPU cores. Your system has ${cpuCores}.`
        );
        return false;
    }

    return true;
}

function checkInternetConnection() {
    return new Promise((resolve) => {
        dns.lookup('google.com', (err) => {
            if (err) {
                console.error("No internet connection detected.");
                dialog.showErrorBox(
                    "Internet Connection Required",
                    "An active internet connection is required to use ReadQuest."
                );
                resolve(false);
            } else {
                console.log("Internet connection detected.");
                resolve(true);
            }
        });
    });
}

function checkScreenResolution() {
  const { screen } = require('electron');
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  console.log(`Screen Resolution: ${width}x${height}`);

  if (width < 1024 || height < 768) {
      dialog.showErrorBox(
          "Low Screen Resolution",
          `ReadQuest requires at least a 1024x768 resolution. Your current resolution is ${width}x${height}.`
      );
      return false;
  }
  return true;
}


app.on("ready", async () => {
  const hasEnoughStorage = await checkStorageBeforeLaunch();
  const hasInternet = await checkInternetConnection();
  const meetsSystemRequirements = checkSystemResources();
  const hasWritePermissions = checkWritePermissions(app.getPath("userData"));
  const screenOK = checkScreenResolution();

  if (!hasEnoughStorage || !hasInternet || !meetsSystemRequirements || !hasWritePermissions || !screenOK) {
      app.quit();
      return;
  }

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
