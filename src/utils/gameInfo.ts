import paths from "@/electron/utils/path"
const { EnkaClient, DetailedGenshinUser, ProfilePicture, Character } =
	require("enka-network-api") as typeof import("enka-network-api")

class GenshinAPI extends EnkaClient {
	constructor(options: any) {
		super(options)
	}

	getInfo(data: any) {
		return new DetailedGenshinUser(data, this)
	}

	getCharacter(data: any) {
		return new Character(data, this)
	}

	getIcon(id: number) {
		return ProfilePicture.getById(id, this)
	}

	Character = Character
}

const genshinAPI = new GenshinAPI({ cacheDirectory: paths.cache, defaultLanguage: "chs" })

export default genshinAPI
