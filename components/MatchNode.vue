<template>
  <div v-if="match">
    <Handle type="target" :position="data.directions.target" style="opacity: 0" />

    <div class="flex flex-col w-[300px] h-[86px] text-xs font-semibold p-1 rounded" :class="{
      'bg-blue-200': match.state == 'Running',
      'bg-white': match.state == 'Created' || match.state == 'Ended',
    }">
      <div :class="{
        'bg-green-300': match.winner == 'Us',
        'bg-red-300':
          match.state == 'Ended' && (match.winner != 'Us' || !match.winner),
      }"
        class="flex justify-between items-center pe-1 bg-gray-300 rounded rounded-b-none border boreder-gray-500 h-[22px] w-full">
        <!-- <UBadge v-if="match.usTeamId" color="sky" :label="match.usTeamId"></UBadge> -->

        <div
          class="border-e-2 w-[30px] h-full border-gray-900 text-center flex justify-center items-center bg-gray-300">
          <p>
            {{ match.usTeamId }}
          </p>
        </div>
        <p v-if="match.usTeam" class="grow text-center" :class="{
          'line-through':
            match.state == 'Ended' &&
            !match.qydhaGameId &&
            (match.winner != 'Us' || !match.winner),
        }">
          {{ match.usTeam.name }}
        </p>
        <p class="grow text-center" v-else-if="!match.usTeam && match.state !== 'Ended'">
          لم يحدد بعد
        </p>
        <p class="grow text-center" v-else-if="!match.usTeam && match.state === 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>

      <div :class="{
        'bg-green-300': match.winner == 'Them',
        'bg-red-300':
          match.state == 'Ended' && (match.winner != 'Them' || !match.winner),
      }"
        class="flex justify-between items-center pe-1 bg-gray-300 border boreder-gray-500 text-center h-[22px] w-full">
        <div
          class="border-e-2 w-[30px] h-full border-gray-900 text-center flex justify-center items-center bg-gray-300">
          <p>
            {{ match.themTeamId }}
          </p>
        </div>
        <p v-if="match.themTeam" class="grow text-center" :class="{
          'line-through':
            match.state == 'Ended' &&
            !match.qydhaGameId &&
            (match.winner != 'Them' || !match.winner),
        }">
          {{ match.themTeam.name }}
        </p>
        <p class="grow text-center" v-else-if="!match.themTeam && match.state != 'Ended'">
          لم يحدد بعد
        </p>
        <p class="grow text-center" v-else-if="!match.themTeam && match.state == 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>
      <div class="flex justify-between text-center h-7">
        <div class="flex items-center bg-gray-300 rounded rounded-t-none border boreder-gray-500 px-1 gap-2">
          <UIcon v-if="match.state == 'Created'" name="mingcute:sleep-fill" />
          <UIcon v-if="match.state == 'Running'" name="eos-icons:loading" />
          <UIcon v-if="match.state == 'Ended'" name="material-symbols:done-all" />
        </div>
        <div class="flex items-center  bg-gray-300 rounded rounded-t-none border boreder-gray-500 px-1 gap-2  ">
          <UIcon name="mingcute:time-line" class="text-xl" />
          <p>
            {{ new Date(match.startAt).toLocaleTimeString('Ar-Eg') }}
          </p>
        </div>



        <div :class="{
          'bg-emerald-400': match.level == 1,
          'bg-cyan-400': match.level == 2,
          'bg-indigo-400': match.level == 3,
          'bg-purple-400': match.level == 4,
          'bg-pink-400': match.level == 5,
          'bg-amber-400': match.level == 6,
          'bg-yellow-400': match.level == 7,
        }" class="flex items-center rounded rounded-t-none border boreder-gray-500 px-1 gap-2">
          <p class="text-white">
            الجولة
            {{ match.level }}
          </p>
        </div>

        <div v-if="match.qydhaGameId" class="h-full items-center flex justify-center">
          <UIcon name="material-symbols:info" class="text-xl text-green-400 cursor-pointer" @click="onClick" />
        </div>
        <div class="flex items-center bg-gray-300 rounded rounded-t-none border boreder-gray-500 px-1 gap-2">
          <UIcon name="material-symbols:table-restaurant" class="text-xl cursor-pointer" @click="copyClipboard" />
          <p>
            {{ match.tableNumber }}
          </p>
        </div>
      </div>
    </div>

    <Handle type="source" :position="data.directions.source" style="opacity: 0" />
  </div>
</template>

<script lang="ts" setup>
import { Position } from "@vue-flow/core";
import { Handle } from "@vue-flow/core";
import type { Match } from "~/models/group";
import StatusModal from "./StatusModal.vue";
const props = defineProps<{ data: { match: Match, directions: { target: Position, source: Position } } }>();
const match = computed(() => props.data.match);
const modal = useModal();
const onClick = () => {
  if (match.value) {
    modal.open(StatusModal, {
      m: match.value,
      onSuccess() {
        modal.close();
      },
    });
  }
};
const copyClipboard = async () => {
  try {
    await navigator.clipboard.writeText(`
    id:${match.value.id}
    qydhaGameId: ${match.value.qydhaGameId} 
    refereeId: ${match.value.refereeId}
    `);
    setTimeout(() => {
    }, 2000);
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error);
  }
  console.log(props.data);
  match.value.id
  match.value.qydhaGameId
  match.value.refereeId
};
</script>

<style></style>
