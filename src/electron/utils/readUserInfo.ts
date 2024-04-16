import fs from 'fs'
import { cachePath } from './path'
import path from 'path'

const userInfoPath = path.resolve(cachePath, 'users');

fs.mkdir(userInfoPath, { recursive: true }, (err) => {
    if (err) throw err
})


export const loadUser = (uid: string | number) => {
    return new Promise((resolve, reject) => {
        uid = uid.toString()
        const filePath = path.resolve(userInfoPath, uid + '.json')
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject()
            }
            return resolve(JSON.parse(data))
        })
    })
}

export const saveUser = (uid: string | number, userInfo: any) => {
    const filePath = path.resolve(userInfoPath, uid + '.json')
    console.log(typeof userInfo);

    fs.writeFile(filePath, userInfo, 'utf8', () => { })
}


const userListFilePath = path.resolve(userInfoPath, 'userList.json')
export const loadUserList = () => {
    if (fs.existsSync(userListFilePath)) {
        const data = fs.readFileSync(userListFilePath, 'utf8')
        return JSON.parse(data)
    } else {
        return [' ', []]
    }
}

export const saveUserList = (data: string) => {
    fs.writeFile(userListFilePath, data, 'utf8', () => { })
}


export const getRawData = (uid: string | number): Promise<any> => {
    return new Promise((resolve, reject) => {
        const rawInfoPath = path.resolve(cachePath, 'raw', uid.toString() + '.json')

        fs.readFile(rawInfoPath, 'utf8', (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(JSON.parse(data))
        })
    })
}

