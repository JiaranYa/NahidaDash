export class AvatarInfo {
    /**
     * 角色ID
     */
    aid: number
    /**
     * 服装ID
     */
    comsumeId: number | undefined
    /**
     * 好感等级
     */
    fetterLevel: number
    /**
     * 命座等级
     */
    upgradeLevel: number
    /**
     * 等级
     */
    level: number
    /**
     * 天赋等级
     */
    // skillLevel
    weapon!: Weapon
    reliquary: Equips
    constructor(data: any) {
        this.aid = data.avatarId
        this.comsumeId = data.costumeId
        this.fetterLevel = data.fetterInfo.expLevel
        this.level = parseInt(data.propMap[4001].val)
        this.upgradeLevel = data.talentIdList ? data.talentIdList.length : 0

        data.equipList.forEach((item: any) => {
            if (item.flat.itemType === "ITEM_WEAPON") {
                this.weapon = new Weapon(item)
            }
        })
        this.reliquary = new Equips(data.equipList)
    }
}

/**
* 武器
*/
class Weapon {
    /**
     * 武器ID
     */
    itemId: number
    /**
     * 武器等级
     */
    level: number
    /**
     * 武器突破等级
     */
    promoteLevel: number
    /**
     * 武器精炼等级
     */
    affixLevel: number

    constructor(data: any) {
        this.itemId = data.itemId
        this.level = data.weapon.level
        this.promoteLevel = data.weapon.promoteLevel
        this.affixLevel = Object.values(data.weapon.affixMap)[0] as number + 1
    }
}

/**
* 圣遗物套装
*/
class Equips {
    flower: Relic | undefined
    plume: Relic | undefined
    sands: Relic | undefined
    goblet: Relic | undefined
    circlet: Relic | undefined
    // relicset

    constructor(data: Array<any>) {
        data.forEach((item) => {
            if (item.flat.itemType === "ITEM_RELIQUARY") {
                const newitem = new Relic(item)
                switch (item.flat.equipType) {
                    case "EQUIP_BRACER": this.flower = newitem; break;
                    case "EQUIP_NECKLACE": this.plume = newitem; break;
                    case "EQUIP_SHOES": this.sands = newitem; break;
                    case "EQUIP_RING": this.goblet = newitem; break;
                    case "EQUIP_DRESS": this.circlet = newitem; break;
                }
            }
        })
    }
}
/**
* 圣遗物单件
*/
class Relic {
    itemId: number
    rank: number
    level: number
    mainPropId: number
    subPropIdList: Array<number>
    constructor(data: any) {
        this.itemId = data.itemId
        this.rank = data.flat.rankLevel
        this.level = data.reliquary.level - 1
        this.mainPropId = data.reliquary.mainPropId
        this.subPropIdList = data.reliquary.appendPropIdList
    }
}