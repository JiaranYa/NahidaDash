import { EnkaClient, ImageAssets } from "enka-network-api"
import path from "path"
import paths from "../utils/path"
import fs from "fs"
import axios from "axios"

global.__dirname = path.resolve()

const enka = new EnkaClient({ cacheDirectory: paths.cache, defaultLanguage: "chs" })
enka.cachedAssetsManager.cacheDirectorySetup()

enka.cachedAssetsManager.activateAutoCacheUpdater({
	instant: true,
	ghproxy: true,
	timeout: 60 * 60 * 1000,
	onUpdateStart: async () => {
		console.log("Updating Genshin Data...")
	},
	onUpdateEnd: async () => {
		enka.cachedAssetsManager.refreshAllData() // Refresh memory
		console.log("Updating Completed!")
	},
})

const fetchAssests = async () => {
	// 名片
	const nameCardList = enka.getAllNameCards()
	nameCardList.forEach(async nameCard => {
		await saveByUrl(nameCard.icon, paths.namecard)
	})
	const characters = enka.getAllCharacters()
	characters.forEach(async character => {
		// 角色卡片
		await saveByUrl(character.cardIcon, paths.icon)
		// 角色头像
		await saveByUrl(character.icon, paths.icon)
		// 角色立绘
		await saveByUrl(character.splashImage, paths.gacha)
		// 角色命座
		character.constellations.forEach(async constellation => {
			await saveByUrl(constellation.icon, paths.constellation)
		})
		// 角色天赋
		character.passiveTalents.forEach(async talent => {
			await saveByUrl(talent.icon, paths.talent)
		})
		await saveByUrl(character.normalAttack.icon, paths.talent)
		await saveByUrl(character.elementalSkill!.icon, paths.talent)
		await saveByUrl(character.elementalBurst!.icon, paths.talent)
	})
	// 武器
	const weapons = enka.getAllWeapons()
	weapons.forEach(async weapon => {
		await saveByUrl(weapon.icon, paths.weapon)
	})
	// 圣遗物
	const artifacts = enka.getAllArtifacts()
	artifacts.forEach(async artifact => {
		await saveByUrl(artifact.icon, paths.reliquary)
	})
}

const saveByUrl = async (assest: ImageAssets, dir_path: string) => {
	const savePath = path.resolve(dir_path, `${assest.name}.png`)
	if (!fs.existsSync(savePath)) {
		try {
			const response = await axios.get(assest.url, { responseType: "stream" })
			response.data.pipe(fs.createWriteStream(savePath))
			return
		} catch (error) {}

		try {
			const ambrUrl = "https://api.ambr.top/assets/UI"
			const enkaUrl = "https://enka.network/ui"
			const url = assest.imageBaseUrl === ambrUrl ? enkaUrl : ambrUrl
			const response = await axios.get(url + "/" + assest.name, { responseType: "stream" })
			response.data.pipe(fs.createWriteStream(savePath))
		} catch (error) {
			console.log(`${assest.name}下载失败`)
		}
	}
}

export { enka, fetchAssests }
