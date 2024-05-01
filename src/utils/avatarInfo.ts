import genshinAPI from "./gameInfo"
import { UserLoader } from "./loader"

export class GIUser {
	nickname
	/**账号uid*/
	uid
	/**等级*/
	level
	/**签名*/
	signature
	/**名片*/
	profileCard
	/**头像*/
	profileIcon

	constructor(data: UserLoader) {
		this.nickname = data.nickname
		this.uid = data.uid
		this.level = data.level
		this.signature = data.signature
		this.profileCard = genshinAPI.getNameCardById(data.nameCardId)
		this.profileIcon = genshinAPI.getIcon(data.profileIconId)
	}
}

export class AvatarInfo {
	/**  角色ID */
	aid: number
	/**  服装ID */
	costumeId: number | undefined
	/**  好感等级 */
	// fetterLevel: number
	/**  命座等级  */
	upgradeLevel: number
	/**  等级 */
	level: number
	/**  突破等级 */
	promotion: number
	/** 天赋等级 */
	skillLevel: Map<string, number>
	/** 天赋命座加成 */
	skillExtraLevel: Map<string, number>
	/** 武器 */
	weapon!: Weapon
	/** 圣遗物 */
	reliquary: Reliquary
	/**  最后更新时间 */
	updateTime: Date

	constructor(data: UserLoader) {
		this.aid = data.aid
		this.costumeId = data.costumeId
		// this.fetterLevel = data.fetterLevel
		this.level = data.level
		this.promotion = data.promotion
		this.upgradeLevel = data.upgradeLevel
		this.skillLevel = data.skillLevel
		this.skillExtraLevel = data.skillExtraLevel
		this.weapon = new Weapon(data.weapon)
		this.reliquary = new Reliquary(data.reliquary)
		this.updateTime = new Date(data.updateTime)
	}

	// static fromEnka(data: Character) {
	// 	return new AvatarInfo({
	// 		aid: data.avatarId,
	// 		costumeId: data.costumeId,
	// 		fetterLevel: data.fetterInfo.expLevel,
	// 		level: parseInt(data.propMap["4001"].val),
	// 		promotion: parseInt(data.propMap["1002"].val),
	// 		upgradeLevel: data.talentIdList ? data.talentIdList.length : 0,
	// 		skillLevel: data.skillLevelMap,
	// 		skillExtraLevel: data.proudSkillExtraLevelMap,
	// 		weapon: Weapon.fromEnka(
	// 			data.equipList.find((item: any) => item.flat.itemType === "ITEM_WEAPON")
	// 		),
	// 		reliquary: Reliquary.fromEnka(data.equipList),
	// 		updateTime: new Date(),
	// 	})
	// }
}

/** 武器 */
class Weapon {
	/**武器ID*/
	itemId!: number
	/**武器等级*/
	level!: number
	/**武器突破等级*/
	promoteLevel!: number
	/**武器精炼等级*/
	affixLevel!: number

	constructor(data: any) {
		// this.itemId = data.itemId
		// this.level = data.level
		// this.promoteLevel = data.promoteLevel
		// this.affixLevel = data.affixLevel
		Object.assign(this, data)
	}

	static fromEnka(data: any) {
		return new Weapon({
			itemId: data.itemId,
			level: data.weapon.level,
			promoteLevel: data.weapon.promoteLevel,
			affixLevel: (Object.values(data.weapon.affixMap)[0] as number) + 1,
		})
	}
}

/**圣遗物套装*/
class Reliquary {
	/**花*/
	flower: Relic | null
	/**羽*/
	plume: Relic | null
	/**沙*/
	sands: Relic | null
	/**杯*/
	goblet: Relic | null
	/**冠*/
	circlet: Relic | null

	constructor(data: any) {
		this.flower = new Relic(data.flower)
		this.plume = new Relic(data.plume)
		this.sands = new Relic(data.sands)
		this.goblet = new Relic(data.goblet)
		this.circlet = new Relic(data.circlet)
		// Object.assign(this, data)
		// Object.keys(data).forEach(key => {
		//     this[key] = data[key] ? new Relic(data[key]) : null;
		// });
	}

	static fromEnka(data: Array<any>) {
		let flower = null
		let plume = null
		let sands = null
		let goblet = null
		let circlet = null
		data.forEach(item => {
			if (item.flat.itemType === "ITEM_RELIQUARY") {
				const newitem = Relic.fromEnka(item)
				switch (item.flat.equipType) {
					case "EQUIP_BRACER":
						flower = newitem
						break
					case "EQUIP_NECKLACE":
						plume = newitem
						break
					case "EQUIP_SHOES":
						sands = newitem
						break
					case "EQUIP_RING":
						goblet = newitem
						break
					case "EQUIP_DRESS":
						circlet = newitem
						break
				}
			}
		})
		return new Reliquary({
			flower: flower,
			plume: plume,
			sands: sands,
			goblet: goblet,
			circlet: circlet,
		})
	}
}

/**圣遗物单件*/
class Relic {
	/**圣遗物ID*/
	itemId!: number
	/**圣遗物等级*/
	level!: number
	/**主属性ID*/
	mainPropId!: number
	/**副属性ID*/
	subPropIdList: number[]
	constructor(data: any) {
		// this.itemId = data.itemId
		// this.level = data.level
		// this.mainPropId = data.mainPropId
		// this.subPropIdList = data.subPropIdList
		this.subPropIdList = []
		Object.assign(this, data)
	}

	static fromEnka(data: any) {
		return new Relic({
			itemId: data.itemId,
			level: data.reliquary.level - 1,
			mainPropId: data.reliquary.mainPropId,
			subPropIdList: data.reliquary.appendPropIdList,
		})
	}
}
