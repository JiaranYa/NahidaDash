import { app, BrowserWindow, ipcMain } from "electron"
import { enka } from "./enkaAPI/enka"
import axios from "axios"
// import path from "path"
import * as infoReader from "./utils/readUserInfo"

// global.__dirname = path.resolve()

axios.create({})

app.whenReady().then(() => {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		title: "Nahida Dash",
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
		win.loadFile("dist/index.html")
	}

	win.on("close", event => {
		win.webContents.send("fetch-save-data")
		event.preventDefault()
		ipcMain.on("save", (_event, userList, users) => {
			infoReader.saveUserList(userList)
			if (users !== null) {
				Object.entries(JSON.parse(users)).forEach(([uid, info]) => {
					infoReader.saveUser(uid, info)
				})
			}
			win.destroy()
		})
	})
})

app.on("window-all-closed", () => {
	app.quit()
})

ipcMain.on("init", async event => {
	const [uid, userList] = infoReader.loadUserList()
	const infolist: { [key: number]: any } = {}

	await Promise.all(
		userList.map(async userid => {
			return infoReader.loadUser(userid).then(data => {
				infolist[userid] = data
			})
		})
	)

	event.reply("init-reply", uid, userList, infolist)
})

// 获取用户信息
ipcMain.on("load", (event, uid) => {
	infoReader
		.loadUser(uid)
		.then(data => {
			event.reply("load-reply", data)
		})
		.catch(() => {
			event.reply("load-reply", null)
		})
})

// 从Enka抓取指定的角色信息
ipcMain.on("update", (event, uid) => {
	// 实际从Enka获取角色信息
	// enka
	// 	.fetchUser(uid)
	// 	.then(user => {
	// 		infoReader.saveRawData(user._data, uid)
	// 		event.reply("update-reply", user._data)
	// 	})
	// 	.catch(error => {
	// 		console.log(error)
	// 	})

	// 用于测试：从本地文件读取角色信息
	infoReader
		.getRawData(uid)
		.then(data => {
			event.reply("update-reply", data)
		})
		.catch(error => {
			console.error(error)
		})
})
