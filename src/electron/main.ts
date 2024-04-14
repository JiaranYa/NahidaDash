import { app, BrowserWindow, ipcMain } from 'electron'
import enka from './enkaAPI/enka'
import axios from 'axios'
import path from "path"
import { loadUsers, saveUser } from './utils/readUserInfo'

global.__dirname = path.resolve()

axios.create({})
const userInfo = loadUsers()

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
    // win.setMinimumSize(1080, 720)

    // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        // Load your file
        win.loadFile('dist/index.html')
    }

    ipcMain.on('init-user-load', (event, uid) => {
        event.reply('init-user-load-reply', userInfo.get(uid))
    })

})

app.on('window-all-closed', () => {
    // 保存用户信息
    saveUser(userInfo)
})


ipcMain.on('get-game-info', (event) => {
    const charInfo = enka.getAllCharacters()
    const charList: any[] = []
    // console.log(charInfo);
    charInfo.forEach((element, _index) => {
        charList.push(element._data)
    })

    event.reply('get-game-info-reply', charList)
})
