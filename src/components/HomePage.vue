<script setup lang="ts">
const { ipcRenderer } = require("electron")
import { useUserStore } from "@/stores/userStore"
import { UserLoader } from "@/utils/loader"
import genshinAPI from "@/utils/gameInfo"
import { computed, ref, onUpdated } from "vue"
import { GIUser } from "@/utils/avatarInfo"
import paths from "@/electron/utils/path"

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

const activeCharIndex = ref(0)

const activeChar = computed(() => {
	return userPanel.value.characters[activeCharIndex.value]
})

const chooseCharacter = (index: number) => {
	activeCharIndex.value = index
}

const test = () => {
	console.log(activeChar.value)
}
</script>

<template>
	<div v-if="Logged" class="login">
		<input type="text" v-model="inputUID" placeholder="请输入UID" />
		<button type="button" @click="initFromEnka">更新</button>
	</div>
	<div v-if="!Logged" class="wrapper">
		<div class="profile item">
			<div>{{ userPanel.profileIcon.icon.name }}</div>
			<div>{{ userPanel.nickname }}</div>
		</div>
		<div class="col item">
			<button type="button" @click="updateFromEnka">update</button>
			<button type="button" @click="updateCache">cache</button>
			<button type="button" @click="test">test</button>
		</div>
		<div class="row item">
			<div>
				<div
					v-for="(item, index) in userPanel.characters"
					:key="item.characterData.id"
					@click="chooseCharacter(index)"
				>
					<img
						class="icon-img"
						:src="'icons/' + item.characterData.icon.name + '.png'"
						alt="item.name"
					/>
				</div>
			</div>
		</div>
		<div class="panel item">
			<div class="basic-info">
				<div class="info">{{ activeChar.characterData.name }} LV.{{ activeChar.level }}</div>

				<div class="constellation">
					<div v-for="item in activeChar.characterData.constellations">
						<img
							class="icon-img"
							:src="'constellations/' + item.icon.name + '.png'"
							alt="item.name"
						/>
					</div>
				</div>
				{{ userPanel.uid }}

				<div class="talent">
					<img
						class="icon-img"
						:src="'talents/' + activeChar.characterData.normalAttack.icon.name + '.png'"
						alt="item.name"
					/>
					{{ activeChar.skillLevels[0].level.value }}

					<img
						class="icon-img"
						:src="'talents/' + activeChar.characterData.elementalSkill!.icon.name + '.png'"
						alt="item.name"
					/>
					{{ activeChar.skillLevels[1].level.value }}

					<img
						class="icon-img"
						:src="'talents/' + activeChar.characterData.elementalBurst!.icon.name + '.png'"
						alt="item.name"
					/>
					{{ activeChar.skillLevels[2].level.value }}
				</div>
			</div>

			<div class="prop">
				<div>
					<img
						class="icon-img"
						:src="'weapons/' + activeChar.weapon.weaponData.icon.name + '.png'"
						alt="item.name"
					/>
					{{ activeChar.weapon.weaponData.name }}
					R{{ activeChar.weapon.refinement!.level }} LV.{{ activeChar.weapon.level }}
				</div>
				<div>
					生命值{{ Math.round(activeChar.stats.currentHealth.value) }} 攻击力{{
						Math.round(activeChar.stats.attack.value)
					}}
					防御力{{ Math.round(activeChar.stats.defense.value) }} 元素精通{{
						Math.round(activeChar.stats.elementMastery.value)
					}}
					暴击率{{ (activeChar.stats.critRate.value * 100).toFixed(1) }}% 暴击伤害{{
						(activeChar.stats.critDamage.value * 100).toFixed(1)
					}}% 元素充能效率{{ (activeChar.stats.chargeEfficiency.value * 100).toFixed(1) }}%
				</div>
			</div>

			<div class="relic">
				<div v-for="item in activeChar.artifacts">
					+{{ item.level - 1 }}
					{{ item.mainstat.fightPropName }}
					+{{ item.mainstat.isPercent ? item.mainstat.value * 100 + "%" : item.mainstat.value }}
					<div v-for="subitem in item.substats.total">
						{{ subitem.fightPropName }}
						+{{
							subitem.isPercent ? (subitem.value * 100).toFixed(1) + "%" : Math.round(subitem.value)
						}}
					</div>
				</div>
			</div>
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
	display: grid;
	grid-template-columns: 300px 300px 300px;
	grid-gap: 10px;
	grid-template-rows: 600px;
	background: #bee7e9;
	.basic-info {
		background: #b21111;
		display: flex;
		flex-direction: column;
		.info {
			width: 100%;
			height: 20%;
		}
		.constellation {
			width: 50%;
			height: 70%;
		}
		.talent {
			display: flex;
			flex-direction: column;
			width: 50%;
		}
	}
}

.icon-img {
	width: 60px;
}
</style>
