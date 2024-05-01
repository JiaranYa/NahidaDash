import paths from "@/electron/utils/path"
const { EnkaClient, DetailedGenshinUser, ProfilePicture } =
	require("enka-network-api") as typeof import("enka-network-api")

class GenshinAPI extends EnkaClient {
	constructor(options: any) {
		super(options)
	}

	getInfo(data: any) {
		return new DetailedGenshinUser(data, this)
	}

	getIcon(id: number) {
		return ProfilePicture.getById(id, this)
	}
}

const genshinAPI = new GenshinAPI({ cacheDirectory: paths.cache, defaultLanguage: "chs" })

export default genshinAPI
