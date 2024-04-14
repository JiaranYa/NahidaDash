import { cachePath } from '@/electron/utils/path'
const { EnkaClient } = require("enka-network-api") as typeof import('enka-network-api')

const enka = new EnkaClient({ cacheDirectory: cachePath, defaultLanguage: "chs" });

export const characterDict = enka.getAllCharacters()
export const weaponDict = enka.getAllWeapons()
export const relicsDict = enka.getAllArtifacts()
export const relicsSetDict = enka.getAllArtifactSets()
