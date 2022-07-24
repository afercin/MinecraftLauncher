const { app, ipcMain, BrowserWindow, session } = require("electron");
const { download } = require("electron-dl");

const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;
let appWin;
let modname;

createWindow = async () => {
    icons = {
        "darwin": "darwin/icon.icns",
        "win32": "win32/icon.ico",
        "linux": "linux/icon.png"
    }
    //Create app window
    appWin = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Kebab a ser launcher",
        icon: `${__dirname}src/assets/icons/${icons[process.platform]}`,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    //Get user session
    ses = appWin.webContents.session

    session.defaultSession.on('will-download', (event, item, webContents) => {
        event.preventDefault()
        require('got')(item.getURL()).then(async (response) => {
            await new Promise(resolve => setTimeout(resolve, 50))
            require('fs').writeFileSync(`/tmp/${response.url.split("/")[8]}`, response.body);
        })
    })

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

ipcMain.on("check_mods", async (event, mod_list) => {
    mod_list.forEach(mod => {
        modname = mod;
        download(
            BrowserWindow.getFocusedWindow(), 
            `http://10.0.0.3:5000/api/v1/server/mods/download/${mod}`, 
            {directory: `/tmp`});
    });
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});