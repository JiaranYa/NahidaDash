import { app, BrowserWindow, ipcMain } from "electron"
import enka from "./enkaAPI/enka"
import axios from "axios"
import path from "path"
import {
	loadUserList,
	saveUserList,
	loadUser,
	saveUser,
	getRawData
} from "./utils/readUserInfo"

global.__dirname = path.resolve()

axios.create({})

app.whenReady().then(() => {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		title: "Nahida Dash",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})
	// win.setMinimumSize(1080, 720)

	// You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
	if (process.env.VITE_DEV_SERVER_URL) {
		win.loadURL(process.env.VITE_DEV_SERVER_URL)
	} else {
		// Load your file
		win.loadFile("dist/index.html")
	}
})

app.on("window-all-closed", () => {
	app.quit()
})

ipcMain.on("init", (event) => {
	const [uid, userList] = loadUserList()
	event.reply("init-reply", uid, userList)
})

// 获取用户信息
ipcMain.on("load", (event, uid) => {
	loadUser(uid)
		.then((data) => {
			event.reply("load-reply", data)
		})
		.catch(() => {
			event.reply("load-reply", null)
		})
})

// 从Enka抓取指定的角色信息
ipcMain.on("update", (event, uid) => {
	// 实际从Enka获取角色信息
	// enka.fetchUser(uid).then(user => {
	//     event.reply('update-reply', user)
	// })

	// 用于测试：从本地文件读取角色信息
	getRawData(uid)
		.then((data) => {
			event.reply("update-reply", data)
		})
		.catch((error) => {
			console.error(error)
		})
})

// 保存用户列表信息
ipcMain.on("info-save", (_event, data: string) => {
	saveUserList(data)
})

// 保存用户
ipcMain.on("save", (_event, uid, info) => {
	saveUser(uid, info)
})
