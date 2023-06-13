import { app, BrowserWindow, ipcMain } from "electron";
import { is } from 'electron-util'
import fs from "fs";
import * as path from 'path'

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    /** origin */ 
    // width: 800,
    // height: 820,
    // minHeight: 600,
    // minWidth: 650,
    /** mobile */ 
    // width: 390,
    // height: 844,
    // minHeight: 360,
    // minWidth: 800,
    /** desktop */ 
    // width: 1920,
    // height: 1080,
    width: 1200,
    height: 800,
    minWidth: 1366,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      // webSecurity: false,
      allowRunningInsecureContent: true,
      // contextIsolation: false,
    },
    show: false,
  });

  const isDev = is.development

  win.loadFile('./index.html')
  // win.loadFile('album.html')
  // win.loadUrl(`/album.html`);


  win.on('closed', () => {
    win = null
  })

  win.webContents.on('devtools-opened', () => {
    win!.focus()
  })

  win.on('ready-to-show', () => {
    win!.show()
    win!.focus()

    if (isDev) {
      win!.webContents.openDevTools({ mode: 'bottom' })
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null && app.isReady()) {
    createWindow()
  }
})

ipcMain.on('ondragstart', (event, filePath) => {
  readFile(filePath);

  function readFile(filePath) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        alert('an error occurred in reading the file: ' + err.message);
        return;
      }
      event.sender.send('fileData', data)
    })

  }
})

// testing to get data ...
// app.on('window-all-closed', (event, data) => {
//   win.loadFile("profil.html");
//   win.webContents.on("did-finish-load", () => {
//     win.webContents.send("userData", data);
//   });
// });