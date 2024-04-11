import { app, BrowserWindow } from 'electron'

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: 'Nahida Dash',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    win.setMinimumSize(1080, 720)

    // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        // Load your file
        win.loadFile('dist/index.html');
    }
})