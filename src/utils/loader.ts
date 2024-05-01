// import { AvatarInfo } from "./avatarInfo"
import type { DetailedGenshinUser } from "enka-network-api"

export class UserLoader {
	/**昵称*/
	nickname: string
	/**账号uid*/
	uid: number
	/**等级*/
	level: number
	/**签名*/
	signature: string
	/**名片 ID*/
	nameCardId: number
	/**头像 ID*/
	profileIconId: number
	/**自机角色表*/
	avatarInfoList: CharLoader[]

	constructor(data: any) {
		this.uid = data?.uid
		this.nickname = data?.nickname
		this.level = data?.level
		this.signature = data?.signature
		this.nameCardId = data?.nameCardId
		this.profileIconId = data?.profileIconId
		this.avatarInfoList = (data.avatarInfoList ?? []).map((item: any) => new CharLoader(item))
	}

	update(newData: DetailedGenshinUser) {
		console.log(newData)

		this.uid = newData.uid
		this.nickname = newData.nickname || ""
		this.level = newData.level
		this.signature = newData.signature || ""
		this.nameCardId = newData.profileCard.id
		this.profileIconId = newData.profilePicture!._data.id as number

		// const avatarInfoList: AvatarInfo[] = []
		// const newAvatarId: number[] = []
		// newData.characters.forEach((item: any) => {
		// 	avatarInfoList.push(AvatarInfo.fromEnka(item))
		// 	newAvatarId.push(item.avatarId)
		// })
		// this.avatarInfoList.forEach((item, _index) => {
		// 	if (newAvatarId.includes(item.aid)) {
		// 		avatarInfoList.push(item)
		// 	}
		// })

		// this.avatarInfoList = avatarInfoList
		return this
	}
}

export class CharLoader {
	constructor(data: any) {}
}
