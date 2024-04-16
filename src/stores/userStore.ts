import { GenshinUser } from "@/utils/genshinUser"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useUserStore = defineStore("user", () => {
	const defaultUid = ref()

	const userList = ref<string[]>([])

	const addUser = (user: string) => {
		if (!userList.value.includes(user)) {
			userList.value.push(user)
		}
	}

	const activeUser = ref<GenshinUser | null>(null)

	const activeCharcID = ref<number | null>(
		activeUser.value?.avatarInfoList[0].aid || null
	)

	return { defaultUid, userList, addUser, activeUser }
})
