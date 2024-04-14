import fs from 'fs'
import { cachePath } from './path'
import path from 'path'

const userInfoPath = path.resolve(cachePath, 'users');

fs.mkdir(userInfoPath, { recursive: true }, (err) => {
    if (err) throw err
})



export const loadUsers = () => {
    const userInfo: Map<string, any> = new Map()
    const files = fs.readdirSync(userInfoPath);

    files.forEach(file => {
        const filePath = path.resolve(userInfoPath, file)
        const data = fs.readFileSync(filePath, 'utf8')
        userInfo.set("213192241", JSON.parse(data));
    })

    return userInfo;

}

export const userInfo = loadUsers()

export const saveUser = (userInfo: Map<string, any>) => {
    userInfo.forEach((value, key) => {
        const filePath = path.resolve(userInfoPath, key + '.json')
        fs.writeFileSync(filePath, JSON.stringify(value), 'utf8')
    })

}


