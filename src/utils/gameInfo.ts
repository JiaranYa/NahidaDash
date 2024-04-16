import { cachePath } from "@/electron/utils/path"
const { EnkaClient } =
	require("enka-network-api") as typeof import("enka-network-api")
// import { EnkaClient } from "enka-network-api"
class GenshinAPI {
	private _client = new EnkaClient({
		cacheDirectory: cachePath,
		defaultLanguage: "chs"
	})

	get characterDict() {
		return this._client.getAllCharacters()
	}
	get weaponDict() {
		return this._client.getAllWeapons()
	}
	get relicsDict() {
		return this._client.getAllArtifacts()
	}
	get relicsSetDict() {
		return this._client.getAllArtifactSets()
	}

	getCharacter(id: number | string) {
		return this._client.getCharacterById(id)
	}
	getWeapon(id: number | string) {
		return this._client.getWeaponById(id)
	}
}

const genshinAPI = new GenshinAPI()
export default genshinAPI
