const { app, BrowserWindow } = require("electron");

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // kiosk: true,  // Make menu bar invisible and non accessible
        // "fullscreen": true,
        // "frame": false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true,
            devTools: true
        }
    });

    mainWindow.on("closed", () => {
        app.quit();
    });

    // loadLocal();
    loadArt();
};

const loadLocal = () => {
    mainWindow.loadURL(`http://localhost:8080`)
        .catch((error) => {
            console.log(error);
        });
};

const loadArt = () => {
    mainWindow.loadURL('file://' + __dirname + '/public/index.html');
};

// To avoid error that WebGL is disabled on Mac Pro (Intel HD 3000).
// https://github.com/electron/electron/issues/8217#issuecomment-267545890
app.commandLine.appendSwitch("ignore-gpu-blacklist");

app.on("ready", createWindow);
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
