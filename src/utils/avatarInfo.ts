export class AvatarInfo {
	/**  角色ID */
	aid: number
	/**  服装ID */
	comsumeId: number | undefined
	/**  好感等级 */
	fetterLevel: number
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
	constructor(data: any) {
		this.aid = data.avatarId
		this.comsumeId = data.costumeId
		this.fetterLevel = data.fetterInfo.expLevel
		this.level = parseInt(data.propMap["4001"].val)
		this.promotion = parseInt(data.propMap["1002"].val)
		this.upgradeLevel = data.talentIdList ? data.talentIdList.length : 0
		this.skillLevel = data.skillLevelMap
		this.skillExtraLevel = data.proudSkillExtraLevelMap

		data.equipList.forEach((item: any) => {
			if (item.flat.itemType === "ITEM_WEAPON") {
				this.weapon = new Weapon(item)
			}
		})
		this.reliquary = new Reliquary(data.equipList)
	}
}

/** 武器 */
class Weapon {
	/**武器ID*/
	itemId: number
	/**武器等级*/
	level: number
	/**武器突破等级*/
	promoteLevel: number
	/**武器精炼等级*/
	affixLevel: number

	constructor(data: any) {
		this.itemId = data.itemId
		this.level = data.weapon.level
		this.promoteLevel = data.weapon.promoteLevel
		this.affixLevel = (Object.values(data.weapon.affixMap)[0] as number) + 1
	}
}

/**圣遗物套装*/
class Reliquary {
	/**花*/
	flower: Relic | undefined
	/**羽*/
	plume: Relic | undefined
	/**沙*/
	sands: Relic | undefined
	/**杯*/
	goblet: Relic | undefined
	/**冠*/
	circlet: Relic | undefined

	constructor(data: Array<any>) {
		data.forEach((item) => {
			if (item.flat.itemType === "ITEM_RELIQUARY") {
				const newitem = new Relic(item)
				switch (item.flat.equipType) {
					case "EQUIP_BRACER":
						this.flower = newitem
						break
					case "EQUIP_NECKLACE":
						this.plume = newitem
						break
					case "EQUIP_SHOES":
						this.sands = newitem
						break
					case "EQUIP_RING":
						this.goblet = newitem
						break
					case "EQUIP_DRESS":
						this.circlet = newitem
						break
				}
			}
		})
	}
}

/**圣遗物单件*/
class Relic {
	/**圣遗物ID*/
	itemId: number
	/**圣遗物等级*/
	level: number
	/**主属性ID*/
	mainPropId: number
	/**副属性ID*/
	subPropIdList: Array<number>
	constructor(data: any) {
		this.itemId = data.itemId
		this.level = data.reliquary.level - 1
		this.mainPropId = data.reliquary.mainPropId
		this.subPropIdList = data.reliquary.appendPropIdList
	}
}
