import { UserLoader } from "@/utils/loader"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useUserStore = defineStore("user", () => {
	const activeUid = ref<number | null>(null)

	const userList = ref<number[]>([])

	const userInfo = ref<{ [key: number]: UserLoader }>({})

	const activeUser = computed(() => {
		return userInfo.value[activeUid.value || 0]
	})

	// const activeCharcID = computed(() => {
	// 	return activeUser.value?.avatarInfoList[0]?.aid || null
	// })
	const addUser = (user: number) => {
		if (!userList.value.includes(user)) {
			userList.value.push(user)
		}
	}
	return { activeUid, userList, userInfo, activeUser, addUser }
})
