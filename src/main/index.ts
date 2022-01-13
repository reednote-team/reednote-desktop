import os from 'os'
import path from 'path'
import { readFileSync } from 'fs'
import { app, BrowserWindow, Menu, dialog } from 'electron'

const isMac = process.platform === 'darwin'

// @ts-ignore
const appMenu = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
	  { 
		id: "new-file",
		enabled: true,
		accelerator: "CmdOrCtrl+N",
		label: "New",
		click: async () => {
			// @ts-ignore
			// createWindow()
		},
	  },
	  { 
		id: "open-file",
		enabled: true,
		accelerator: "CmdOrCtrl+O",
		label: "Open ...",
		click: async () => {
			// @ts-ignore
			// win.webContents.send("open-file")

			dialog.showOpenDialog(win, {
				properties: ['openFile'],
			}).then((result) => {
				console.log(result.canceled);
				const content = readFileSync(result.filePaths[0], 'utf-8')
				// @ts-ignore
				win.webContents.send("open-file", { 
					content: content, 
					filePath: result.filePaths[0]
				})
			}).catch(err => {
				console.log(err)
			})
		},
	  },
	  { 
		id: "save-copy",
		enabled: true,
		accelerator: "CmdOrCtrl+Shift+S",
		label: "Save Copy to ...",
		click: async () => {

			// @ts-ignore
			dialog.showSaveDialog(win, {
				title: "Save Copy to ...",
				buttonLabel: "Save",
				filters: [
					{ name: 'Markdown', extensions: ['md'] },
					{ name: 'Pure Text', extensions: ['txt']},
					{ name: 'All Files', extensions: ['*']},
				]
			}).then((fileName) => {
				console.log(fileName.filePath)
				// @ts-ignore
				win.webContents.send("save-copy", { 
					filePath: fileName.filePath
				})
			}).catch(err => {
				console.log(err)
			})
			// @ts-ignore
			win.webContents.send("save-copy")

		},
	  },
	  { 
		id: "save-file",
		enabled: true,
		accelerator: "CmdOrCtrl+S",
		label: "Save",
		click: async () => {
			// @ts-ignore
			win.webContents.send("save-file")
		},
	  },
      isMac ? { role: 'close' } : { role: 'quit' },



    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]


// https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js
const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// @ts-ignore
const menu = Menu.buildFromTemplate(appMenu)
Menu.setApplicationMenu(menu)

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
    },
	// titleBarStyle: 'hiddenInset'
  })

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  } else {
    const pkg = await import('../../package.json')
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`

    win.loadURL(url)
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// @TODO
// auto update
/* if (app.isPackaged) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) =>
      // maybe you need to record some log files.
      console.error('Failed check update:', e)
    )
} */


