import { AvatarInfo } from "./avatarInfo"

export class GenshinUser {
	/**昵称*/
	nichname: string
	/**账号uid*/
	uid: string
	/**等级*/
	level: number
	/**签名*/
	signature: number
	/**名片 ID*/
	nameCardId: number
	/**头像 ID*/
	profileIconId: number
	/**自机角色表*/
	avatarInfoList: AvatarInfo[]

	constructor(data: any) {
		this.uid = data.uid
		this.nichname = data.playerInfo.nickname
		this.level = data.playerInfo.level
		this.signature = data.playerInfo.signature
		this.nameCardId = data.playerInfo.nameCardId
		this.profileIconId = data.playerInfo.profilePicture.avatarId

		this.avatarInfoList = []
		data.avatarInfoList.forEach((item: any) => {
			this.avatarInfoList.push(new AvatarInfo(item))
		})
	}

	update(newData: any) {
		this.uid = newData.uid
		this.nichname = newData.playerInfo.nickname
		this.level = newData.playerInfo.level
		this.signature = newData.playerInfo.signature
		this.nameCardId = newData.playerInfo.nameCardId
		this.profileIconId = newData.playerInfo.profilePicture.avatarId

		const avatarInfoList: AvatarInfo[] = []
		const newAvatarId: number[] = []
		newData.avatarInfoList.forEach((item: any) => {
			avatarInfoList.push(new AvatarInfo(item))
			newAvatarId.push(item.avatarId)
		})
		this.avatarInfoList.forEach((item, _index) => {
			if (newAvatarId.includes(item.aid)) {
				avatarInfoList.push(item)
			}
		})

		this.avatarInfoList = avatarInfoList
	}
}
