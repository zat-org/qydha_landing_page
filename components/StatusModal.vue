<template>
  <UModal class="w-[500px] ">

    <div class="flex flex-col">

      <div class="flex justify-end p-1">
        <UButton color="red" icon="material-symbols:close" variant="soft" @click="modal.close()" />
      </div>
      <UTabs :items="items" class="w-full p-5">
        <template #status>
            <Statistics :state="game?.state!" :statistics="game?.statistics!" />
        </template>

        <template #news>
          <div class="flex flex-col items-center gap-2 w-full overflow-y-scroll h-[500px] ">
            <div class="flex  gap-2 items-center    ">
              <div class="flex flex-col gap-1  items-center w-[200px] p-2  rounded-lg border " :class="{
                'bg-green-400/20 text-green-500 border-green-300 ': game?.state.winner == 'Us',
                'bg-red-400/20 text-red-500 border-red-300 ': game?.state.winner == 'Them'
              }">
                <p class="text-xs  text-center">{{ game?.state.usName.split("|")[0] }}</p>
                <p class="text-xs  text-center">{{ game?.state.usName.split("|")[1] }}</p>
                <p class="text-xs  text-center bg-slate-300/60 w-1/2 px-2 py-1 rounded-lg"> {{ game?.state.usGameScore
                  }} صكة</p>
              </div>
              <div class="flex flex-col gap-1 justify-center items-center">
                <UIcon name="fxemoji:squaredvs" class="text-lg md:text-2xl" />

              </div>

              <div class="flex flex-col gap-1 justify-center items-center w-[200px] p-2  rounded-lg border " :class="{
                'bg-green-400/20 text-green-500 border-green-300 ': game?.state.winner == 'Them',
                'bg-red-400/20 text-red-500 border-red-300 ': game?.state.winner == 'Us'
              }">
                <p class="text-xs  text-center">{{ game?.state.themName.split("|")[0] }}</p>
                <p class="text-xs  text-center">{{ game?.state.themName.split("|")[1] }}</p>
                <p class="text-xs  text-center bg-slate-300/60 w-1/2 px-2 py-1 rounded-lg">
                  {{ game?.state.themGameScore }}
                </p>
              </div>
            </div>

            
            <div v-for="(sakka, index) in game?.state.sakkas"
              class="flex flex-col gap-2 w-full bg-gradient-to-b from-slate-200 to-slate-300  py-1  px-2 rounded-lg ">

              <div class="w-full flex justify-center items-center  gap-[80px] ">

                <UBadge :color="sakka.winner && sakka.winner == 'Us' ? 'green' : 'red'">{{ sakka.usSakkaScore }}</UBadge>
                <p class=""> الصكة {{ game?.state.sakkas.length! - index }} </p>
                <UBadge :color="sakka.winner && sakka.winner == 'Them' ? 'green' : 'red'">{{ sakka.themSakkaScore }}</UBadge>
              </div>
              <UDivider />
              <div class="flex flex-col">
                <div v-for="mos in sakka.moshtaras">
                  <div v-if="mos.state != 'Running'" class="w-full flex justify-center gap-[230px] items-center">
                    <p>{{ mos.usAbnat }}</p>
                    <p>{{ mos.themAbnat }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UTabs>

    </div>
    <!-- <UTooltip :text="game.state">
      <UButton color="gray" label="" />
    </UTooltip> -->
  </UModal>
</template>

<script lang="ts" setup>
import type { Match } from "~/models/group";
import type { IMatchData, IMathStat } from "~/models/MatchStat";
// import { useMyTournamentStore } from "~/store/tournament";

const props = defineProps<{ m: string }>();
const modal = useModal();
// const gameStore = useMyTournamentStore()
const game = ref<{ state: IMatchData, statistics: IMathStat }>();



const gameApi = useMatch()
const matchData = await gameApi.getMatchData()
await matchData.fetchREQ(props.m)
if (matchData.status.value == "success" && matchData.data.value)
  game.value = matchData.data.value.data

// games.value.push({ id: matchData.data.value?.data.state.id, game: matchData.data.value?.data.state, statistics: matchData.data.value?.data.statistics })
// console.log(games.value)


// const game =computed(()=>{
//   const selectedGame = gameStore.games.find(g => g.id === props.m.qydhaGameId);
//   return selectedGame
// })







const items = [
  {
    slot: "status",
    label: "الاحصائيات",
  },
  {
    slot: "news",
    label: "النشرة",
  },
];
</script>

<style></style>
