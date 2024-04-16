<script setup lang="ts">
const { ipcRenderer } = require("electron")
import { useUserStore } from "@/stores/userStore"
import { GenshinUser } from "@/utils/genshinUser";


const userStore = useUserStore()

defineProps<{ msg: string }>()

const setUid = () => {
  const uid = "213192241"
  userStore.defaultUid = uid
  userStore.addUser(uid)
  ipcRenderer.send("load", uid)
  ipcRenderer.on("load-reply", (_event, data) => {
    if (data) {
      userStore.activeUser = new GenshinUser(data)
    } else {
      userStore.activeUser = null
    }
  })
}

const updateFromEnka = () => {
  ipcRenderer.send("update", userStore.defaultUid)
  ipcRenderer.on("update-reply", (_event, data) => {
    if (userStore.activeUser) {
      userStore.activeUser.update(data)
    } else {
      userStore.activeUser = new GenshinUser(data)
    }
  })
}

const saveInfo = () => {
  ipcRenderer.send("info-save", JSON.stringify([userStore.defaultUid, userStore.userList]))

  if (userStore.activeUser) {
    ipcRenderer.send("save", userStore.activeUser.uid, JSON.stringify(userStore.activeUser))
  }
}

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="setUid">set</button>
    <button type="button" @click="updateFromEnka">update</button>
    <button type="button" @click="saveInfo">save</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
