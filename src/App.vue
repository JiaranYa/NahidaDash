<script setup lang="ts">
// import HelloWorld from "./components/HelloWorld.vue"
// import genshinAPI from "./utils/gameInfo"
import { UserLoader } from "@/utils/loader"
const { ipcRenderer } = require("electron")
import { onMounted } from "vue"
import { useUserStore } from "@/stores/userStore"
import HomePage from "./components/HomePage.vue"

const userStore = useUserStore()

onMounted(() => {
	ipcRenderer.send("init")

	ipcRenderer.on("init-reply", (_event, uid, userList, userInfo) => {
		userStore.activeUid = uid
		userStore.userList = userList
		userStore.userInfo = Object.entries(userInfo).reduce(
			(acc: { [key: number]: UserLoader }, [key, value]) => {
				acc[parseInt(key)] = new UserLoader(value)
				return acc
			},
			{}
		)
	})
})

ipcRenderer.on("fetch-save-data", _event => {
	ipcRenderer.send(
		"save",
		JSON.stringify([userStore.activeUid, userStore.userList]),
		JSON.stringify(userStore.userInfo)
	)
})

</script>

<template>
	<!-- <div>
		<a href="https://vitejs.dev" target="_blank">
			<img src="/vite.svg" class="logo" alt="Vite logo" />
		</a>
		<a href="https://vuejs.org/" target="_blank">
			<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
		</a>
	</div> -->
	<!-- <HelloWorld msg="Vite + Vue" /> -->
	<HomePage />
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}

.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
./utils/gameInfo
