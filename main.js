const { app, ipcMain, BrowserWindow, session, dialog } = require("electron");
const { download } = require("electron-dl");
const fs = require('fs');
const shell = require('electron').shell;
var propertiesReader = require('properties-reader');
var rootPath = require('electron-root-path').rootPath;

const isDev = rootPath.indexOf("dev") !== -1;
let appWin;
let modsFolder;
let eventHandler

createWindow = async () => {
    icons = {
        "darwin": "darwin/icon.icns",
        "win32": "win32/icon.ico",
        "linux": "linux/icon.png"
    }
    //Create app window
    appWin = new BrowserWindow({
        width: 1066,
        height: 600,
        title: "Kebab a ser launcher",
        icon: `${__dirname}src/assets/icons/${icons[process.platform]}`,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    session.defaultSession.on('will-download', (event, item) => {
        event.preventDefault()
        require('got')(item.getURL()).then((response) => {
            console.log(`${modsFolder}/${response.url.split("/")[8]}`);          
            fs.writeFileSync(`${modsFolder}/${response.url.split("/")[8]}`, response.body);
            eventHandler.reply("download_mod", true);
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

ipcMain.on("get_mods", async (event, args) => {
    var properties = propertiesReader(`${rootPath}/launcher.properties`);
    modsFolder = properties.get("MODS_FOLDER");
    if (modsFolder === "") {
        response = await dialog.showOpenDialog({
            title: "Seleccione la carpeta de mods de Minecraft",
            defaultPath: app.getPath('appData'),
            properties: ['openDirectory']
        });
        if (!response.cancelled) {
            modsFolder = response.filePaths;
            properties.set("MODS_FOLDER", modsFolder);
            await properties.save(`${rootPath}/launcher.properties`, (err, data) => {
                if (err)
                    console.log("error in write a properties file")
                console.log("saved data to properties file")
            })
        }
    }
    if (modsFolder === "") 
        app.quit()
    
    event.reply("get_mods", fs.readdirSync(modsFolder));
});

ipcMain.on("download_mod", (event, mod) => {
    eventHandler = event;
    download(
        BrowserWindow.getFocusedWindow(), 
        `http://kebabaser.ddns.net:5000/api/v1/server/mods/download/${mod}`);
})

ipcMain.on("open_url", (event, url) => {
    shell.openExternal(url);
})

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});