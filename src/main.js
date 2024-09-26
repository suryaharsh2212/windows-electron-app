const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const WebSocket = require("ws");
const { spawn, exec } = require("child_process");

let scrcpyProcess = null;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools(); 
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const decodedMessage = message.toString("utf-8");
    
    if (decodedMessage === "start") {
      console.log("Received message:", decodedMessage);
      ws.send("Hello from Electron!");
      startScrcpy(ws);
      simulateTap(500, 500);
      togglePower
    } else if (decodedMessage === 'stop') {
      stopScrcpy();
      console.log("The Screening has stopped");
    } else {
      console.log("Received non-buffer message:", message);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    stopScrcpy();
  });
});

function startScrcpy(ws) {
  scrcpyProcess = spawn("scrcpy", ["-d", "--video-codec=h265", "--max-size=1920", "--max-fps=60", "--no-audio"]);

  scrcpyProcess.stdout.on("data", (data) => {
    console.log("scrcpy stdout:", data.toString());
  });

  scrcpyProcess.stderr.on("data", (data) => {
    console.error(`scrcpy stderr: ${data}`);
  });

  scrcpyProcess.on("close", (code) => {
    console.log(`scrcpy process exited with code ${code}`);
  });
}

function sendAdbCommand(command) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ADB command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`ADB stderr: ${stderr}`);
      return;
    }
    console.log(`ADB stdout: ${stdout}`);
  });
}

function simulateTap(x, y) {
  const command = `adb shell input tap ${x} ${y}`;
  sendAdbCommand(command);
}

function simulateSwipe(x1, y1, x2, y2, duration = 300) {
  const command = `adb shell input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`;
  sendAdbCommand(command);
}

function pressBackButton() {
  const command = `adb shell input keyevent KEYCODE_BACK`;
  sendAdbCommand(command);
}

function togglePower() {
  const command = `adb shell input keyevent KEYCODE_POWER`;
  sendAdbCommand(command);
}

function stopScrcpy() {
  if (scrcpyProcess) {
    scrcpyProcess.kill();
  }

  exec("adb kill-server", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error stopping scrcpy: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`scrcpy stderr: ${stderr}`);
      return;
    }
    console.log(`scrcpy stopped: ${stdout}`);
  });
}
