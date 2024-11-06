<template>
  <div>
    <Handle type="target" :position="Position.Left" style="opacity: 0" />
    <div class="flex flex-col w-[300px] h-[86px] text-xs font-semibold p-1 rounded" :class="{
      'bg-blue-200': data.match.state == 'Running' || data.match.state == 'Paused',
      'bg-white': data.match.level != 1 && data.match.state == 'Created' || data.match.state == 'Ended',
      'border-2 border-[#FFD200] ': data.match.level == 1 && data.match.matchQualifyThemTeamFrom == 'Winner' && data.match.matchQualifyUsTeamFrom == 'Winner',
      'border-2 border-[#536976] ': data.match.level == 1 && data.match.matchQualifyThemTeamFrom == 'Loser' && data.match.matchQualifyUsTeamFrom == 'Loser',

    }">
      <div :class="{
        'bg-green-300': data.match.winner?.toLowerCase() == 'us' && data.match.level!=1 ,
        'bg-gradient-to-r from-[#F7971E] to-[#FFD200]': data.match.winner?.toLowerCase() == 'us' && data.match.level ==1,
        'bg-red-300': data.match.state == 'Ended' && (data.match.winner?.toLowerCase() == 'them' || !data.match.winner),
          'bg-gradient-to-r   to-slate-300 from-slate-500': data.match.winner?.toLowerCase() != 'us' && data.match.level ==1 &&  data.match.matchQualifyThemTeamFrom=='Winner',
      }"
        class="flex justify-between items-center pe-1 bg-gray-300 rounded rounded-b-none border boreder-gray-500 h-[22px] w-full">
        <!-- <UBadge v-if="data.usTeamId" color="sky" :label="data.usTeamId"></UBadge> -->

        <div
          class="border-e-2 w-[30px] h-full border-gray-900 text-center flex justify-center items-center bg-gray-300">
          <p>
            <!-- {{ data.match.usTeamId }}
               -->
            {{ data.match.usTeamName && data.match.usTeamName.split("-").length > 1 ?
              data.match.usTeamName.split("-")[0] :
              data.match.usTeamId }}

          </p>
        </div>
        <p v-if="data.match.usTeamId" class="grow text-center" :class="{
          'line-through':
            data.match.state == 'Ended' &&
            !data.match.qydhaGameId &&
            (data.match.winner?.toLowerCase() == 'them' || !data.match.winner),
        }">
          {{ data.match.usTeamName }}
        </p>
        <p class="grow text-center" v-else-if="!data.match.usTeamId && data.match.state !== 'Ended'">
          لم يحدد بعد
        </p>
        <p class="grow text-center" v-else-if="!data.match.usTeamId && data.match.state === 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>

      <div  :class="{
        'bg-green-300': data.match.winner?.toLowerCase() == 'them' && data.match.level!=1,
        'bg-gradient-to-r from-[#F7971E] to-[#FFD200]': data.match.winner?.toLowerCase()== 'them' && data.match.level ==1,

        'bg-red-300':
          data.match.state == 'Ended' && (data.match.winner?.toLowerCase() == 'us' || !data.match.winner),
        'bg-gradient-to-r   to-slate-300 from-slate-500': data.match.winner?.toLowerCase() == 'us' && data.match.level ==1 &&  data.match.matchQualifyThemTeamFrom=='Winner',
          
      }"
        class="flex justify-between items-center pe-1 bg-gray-300 border boreder-gray-500 text-center h-[22px] w-full">
        <div
          class="border-e-2 w-[30px] h-full border-gray-900 text-center flex justify-center items-center bg-gray-300">
          <p>
            <!-- {{ data.match.themTeamId }} -->
            {{
              data.match.themTeamName && data.match.themTeamName.split("-").length > 1 ?
                data.match.themTeamName.split("-")[0]
                : data.match.themTeamId }}

          </p>
        </div>
        <p v-if="data.match.themTeamName" class="grow text-center" :class="{
          'line-through':
            data.match.state == 'Ended' &&
            !data.match.qydhaGameId &&
            (data.match.winner?.toLowerCase() == 'us' || !data.match.winner),
        }">
          {{ data.match.themTeamName }}
        </p>
        <p class="grow text-center" v-else-if="!data.match.themTeamId && data.match.state != 'Ended'">
          لم يحدد بعد
        </p>
        <p class="grow text-center" v-else-if="!data.match.themTeamId && data.match.state == 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>
      <div class="flex justify-between text-center h-7">


        <div class="flex items-center bg-gray-300 rounded rounded-t-none border boreder-gray-500 px-1 gap-2">
          <IconSleepGame v-if="data.match.state == 'Created' || data.match.state == 'Paused'" />
          <IconRunningGame v-if="data.match.state == 'Running'"  />
          <IconEndedGame v-if="data.match.state == 'Ended'"  />
        </div>

        <div v-if="data.match.roundName" :class="{
          'bg-emerald-400': data.match.level == 1,
          'bg-amber-400': data.match.level == 2,
          'bg-indigo-400': data.match.level == 3,
          'bg-cyan-400': data.match.level == 4,
        }" class="flex items-center rounded rounded-t-none border boreder-gray-500 px-1 gap-2">
          <!-- <UIcon name="material-symbols:table-restaurant" class="text-xl" /> -->
          <p :class="{ 'text-black': data.match.level > 4, 'text-white': data.match.level <= 4 }">
            {{ data.match.roundName }}
          </p>
        </div>
        <div v-if="data.match.startAt"
          class="flex items-center rounded rounded-t-none border boreder-gray-500 bg-gray-300 px-1 gap-2">
          <p>
            {{ new Date(data.match.startAt).toLocaleTimeString("ar", {
              hour: "2-digit",
              minute: "2-digit",
            }) }}
          </p>
        </div>
        <div v-if="data.match.qydhaGameId" class="h-full items-center flex justify-center">
          
          <IconInfo v-if="data.match.state != 'Created'" 
            class="text-xl text-green-400 cursor-pointer" @click="onclick" />
        </div>

        <div class=" h-full items-center flex justify-center "
          v-if="privilege?.toLowerCase() == 'admin' || privilege?.toLowerCase() == 'owner' || permissions.includes('')">
          <IconSetting  class="text-xl text-yellow-500 cursor-pointer" @click="onEdit" />
        </div>

        <div class=" h-full items-center flex justify-center "
          v-if="(privilege?.toLowerCase() == 'admin' || privilege?.toLowerCase() == 'owner' || permissions.includes('')) && data.match.referee">
          <UTooltip :text="data.match.referee.username">

            <IconRefree  class="text-xl text-blue-500 cursor-pointer" />
          </UTooltip>
        </div>

        <div class="flex items-center bg-gray-300 rounded rounded-t-none border boreder-gray-500 px-1 gap-2">
          <IconTable class="text-xl cursor-pointer" @click="copyClibboard" />
          <p>
            {{ data.match.tableName }}
          </p>
        </div>
      </div>
    </div>
    <Handle type="source" :position="Position.Right" style="opacity: 0" />
  </div>
</template>

<script lang="ts" setup>
import { Position } from "@vue-flow/core";
import { Handle } from "@vue-flow/core";
import type { Match } from "@/models/group";
import { useMyAuthStore } from "@/store/Auth";
import StatusModal from "./StatusModal.vue";
import EditModal from "./EditModal.vue";
const props = defineProps<{ data: { match: Match } }>();
// const qydhamatch:Match= props.data.match 
const useStore = useMyAuthStore()
const { privilege, permissions } = storeToRefs(useStore)
const modal = useModal();



const onclick = () => {
  
  console.log("clicked")
  modal.open(StatusModal,
    {
      m: props.data.match
    });

};
const copyClibboard = async () => {
  try {
    await navigator.clipboard.writeText(`
    id:${props.data.match.id}
    qydhaGameId: ${props.data.match.qydhaGameId} 
    refereeId: ${props.data.match.referee.id}
    `);
    setTimeout(() => {
    }, 2000);
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error);
  }
  console.log(props.data);
  // props.data.id
  // props.data.qydhaGameId
  // props.data.refereeId
};

const onEdit = () => {

  modal.open(EditModal,
    {
      match: props.data.match
    })
}
</script>

<style></style>
