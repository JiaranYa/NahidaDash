import fs from "fs"
import paths from "./path"
import path from "path"

export const loadUser = (uid: string | number) => {
	return new Promise((resolve, reject) => {
		uid = uid.toString()
		const filePath = path.resolve(paths.userInfo, uid + ".json")
		fs.readFile(filePath, "utf8", (err, data) => {
			if (err) {
				return reject()
			}
			return resolve(JSON.parse(data))
		})
	})
}

export const saveUser = (uid: string | number, userInfo: any) => {
	const filePath = path.resolve(paths.userInfo, uid + ".json")

	fs.writeFile(filePath, JSON.stringify(userInfo), "utf8", () => {})
}

const userListFilePath = path.resolve(paths.userInfo, "userList.json")
export const loadUserList = (): [number | null, number[]] => {
	if (fs.existsSync(userListFilePath)) {
		const data = fs.readFileSync(userListFilePath, "utf8")
		return JSON.parse(data)
	} else {
		return [null, []]
	}
}

export const saveUserList = (data: string) => {
	fs.writeFile(userListFilePath, data, "utf8", () => {})
}

export const saveRawData = (data: object, uid: string | number) => {
	uid = uid.toString()

	fs.writeFile(path.resolve(paths.rawInfo, uid + ".json"), JSON.stringify(data), "utf8", () => {})
}

// 仅用于测试
export const getRawData = (uid: string | number): Promise<any> => {
	return new Promise((resolve, reject) => {
		const rawFilePath = path.resolve(paths.rawInfo, uid.toString() + ".json")

		fs.readFile(rawFilePath, "utf8", (err, data) => {
			if (err) {
				reject(err)
				return
			}
			resolve(JSON.parse(data))
		})
	})
}
