<script setup lang="ts">
const { ipcRenderer } = require("electron")
import { useUserStore } from "@/stores/userStore"
import { UserLoader } from "@/utils/loader"
import genshinAPI from "@/utils/gameInfo"
import { computed, ref } from "vue"
import { GIUser } from "@/utils/avatarInfo"

const userStore = useUserStore()

const Logged = computed(() => {
	return userStore.activeUser === undefined
})

const inputUID = ref("")

const updateFromEnka = () => {
	ipcRenderer.send("update", userStore.activeUid)
	ipcRenderer.on("update-reply", (_event, data) => {
		const userInfo = genshinAPI.getInfo(data)
		userStore.activeUser.update(userInfo)

		console.log(new GIUser(userStore.activeUser))
	})
}

const initFromEnka = () => {
	ipcRenderer.send("update", inputUID.value)
	ipcRenderer.on("update-reply", (_event, data) => {
		const userInfo = genshinAPI.getInfo(data)
		userStore.activeUid = userInfo.uid
		userStore.addUser(userInfo.uid)
		userStore.userInfo[userInfo.uid] = new UserLoader({}).update(userInfo)
	})
}

const userPanel = computed(() => {
	return new GIUser(userStore.activeUser)
})

const updateCache = () => {
	ipcRenderer.send("update-cache")
}
const test = () => {
	console.log(genshinAPI.getAllArtifacts())
}
</script>

<template>
	<div v-if="Logged" class="login">
		<input type="text" v-model="inputUID" placeholder="请输入UID" />
		<button type="button" @click="initFromEnka">更新</button>
	</div>
	<div v-if="!Logged" class="wrapper">
		<div class="profile item">{{ userPanel.nickname }}</div>
		<div class="col item">
			<button type="button" @click="updateFromEnka">update</button>
			<button type="button" @click="updateCache">cache</button>
		</div>
		<div class="row item">Three</div>
		<div class="panel item">
			<button type="button" @click="test">test</button>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	margin: 10px;
	/* 声明一个容器 */
	display: grid;
	/*  声明列的宽度  */
	grid-template-columns: 200px 1000px;
	/*  声明行间距和列间距  */
	grid-gap: 10px;
	/*  声明行的高度  */
	grid-template-rows: 100px 600px;
	background: #245222;
}
.profile {
	background: #19caad;
}
.col {
	background: #8cc7b5;
}
.row {
	background: #d1ba74;
}
.panel {
	background: #bee7e9;
}
/* .five {
	background: #e6ceac;
}
.six {
	background: #ecad9e;
} */
/* .item {
	text-align: center;
	font-size: 200%;
	color: #fff;
} */
</style>
