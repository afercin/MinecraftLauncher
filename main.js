const { app, ipcMain, BrowserWindow } = require("electron");
const fs = require('fs');

const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;
let appWin;

createWindow = async () => {
    icons = {
        "darwin": "darwin/icon.icns",
        "win32": "win32/icon.ico",
        "linux": "linux/icon.png"
    }
    //Create app window
    appWin = new BrowserWindow({
        width: 1920,
        height: 1080,
        title: "Cross Game",
        icon: `${__dirname}src/assets/icons/${icons[process.platform]}`,
        resizable: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    //Load main html
    appWin.loadURL(`file://${__dirname}/release/index.html`);
    //Disable menu
    appWin.setMenu(null);

    if (isDev)
        appWin.webContents.openDevTools();

    appWin.on("closed", () => {
        appWin = null;
    });
}

ipcMain.on("change_mode", async (event, arg) => {
    fs.writeFile('/tmp/crossgame.mode', arg, { flag: 'w' }, err => { });
    event.reply("change_mode", arg);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("before-input-event", (event, input) => {
    console.log(input);
});