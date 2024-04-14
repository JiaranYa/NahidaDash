<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import * as genshinAPI from './utils/gameInfo'
import { GenshinUser } from '@/utils/genshinUser'
const { ipcRenderer } = require('electron')


const uid = '213192241'
ipcRenderer.send('init-user-load', uid)

ipcRenderer.on('init-user-load-reply', (_event, _data) => {
  console.log(_data);
  const user = new GenshinUser(_data)
  console.log(user);

})

// console.log(genshinAPI.characterDict)
// console.log(genshinAPI.weaponDict)
// console.log(genshinAPI.relicsDict)
// console.log(genshinAPI.relicsSetDict)


</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
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