import { EnkaClient } from "enka-network-api"
import path from "path"
import { cachePath } from "../utils/path"

global.__dirname = path.resolve()


const enka = new EnkaClient({ cacheDirectory: cachePath, defaultLanguage: "chs" });
enka.cachedAssetsManager.cacheDirectorySetup();

enka.cachedAssetsManager.activateAutoCacheUpdater({
    instant: true,
    ghproxy: true,
    timeout: 60 * 60 * 1000,
    onUpdateStart: async () => {
        console.log("Updating Genshin Data...");
    },
    onUpdateEnd: async () => {
        enka.cachedAssetsManager.refreshAllData(); // Refresh memory
        console.log("Updating Completed!");
    }
}

)

export default enka