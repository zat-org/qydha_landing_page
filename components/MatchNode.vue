<template>
  <div>
    <Handle type="target" :position="Position.Left" style="opacity: 0" />
    <div
      class="flex flex-col w-[300px] h-[65px] text-xs font-semibold p-1 rounded"
      :class="{
        'bg-blue-200': data.state == 'Running',
        'bg-white': data.state == 'Created' || data.state == 'Ended',
      }">
      <div
        :class="{
          'bg-green-300': data.winner == 'Us',
          'bg-red-300':
            data.state == 'Ended' && (data.winner != 'Us' || !data.winner),
        }"
        class="flex justify-between items-center pe-1 bg-gray-300 rounded rounded-b-none border boreder-gray-500 h-10 w-full">
        <!-- <UBadge v-if="data.usTeamId" color="sky" :label="data.usTeamId"></UBadge> -->

        <div
          class="border-e-2 w-[30px] h-full border-gray-900 text-center flex justify-center items-center bg-gray-300">
          <p>
            {{ data.usTeamId }}
          </p>
        </div>
        <p
          v-if="data.usTeam"
          class="grow text-center"
          :class="{
            'line-through':
              data.state == 'Ended' &&
              !data.qydhaGameId &&
              (data.winner != 'Us' || !data.winner),
          }">
          {{ data.usTeam.name }}
        </p>
        <p
          class="grow text-center"
          v-else-if="!data.usTeam && data.state !== 'Ended'">
          لم يحدد بعد
        </p>
        <p
          class="grow text-center"
          v-else-if="!data.usTeam && data.state === 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>

      <div
        :class="{
          'bg-green-300': data.winner == 'Them',
          'bg-red-300':
            data.state == 'Ended' && (data.winner != 'Them' || !data.winner),
        }"
        class="flex justify-between items-center pe-1 bg-gray-300 border boreder-gray-500 text-center h-10 w-full">
        <div
          class="border-e-2 w-[30px] h-full border-gray-900 text-center flex justify-center items-center bg-gray-300">
          <p>
            {{ data.themTeamId }}
          </p>
        </div>
        <p
          v-if="data.themTeam"
          class="grow text-center"
          :class="{
            'line-through':
              data.state == 'Ended' &&
              !data.qydhaGameId &&
              (data.winner != 'Them' || !data.winner),
          }">
          {{ data.themTeam.name }}
        </p>
        <p
          class="grow text-center"
          v-else-if="!data.themTeam && data.state != 'Ended'">
          لم يحدد بعد
        </p>
        <p
          class="grow text-center"
          v-else-if="!data.themTeam && data.state == 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>
      <div class="flex justify-between text-center h-7">
        <!--    
        <div class="flex items-center  bg-gray-300 rounded rounded-t-none border boreder-gray-500 px-1 gap-2  ">
          <UIcon name="mingcute:time-line" class="text-xl" />
          <p >
            {{ new Date(data.startAt).toLocaleString()  }}
          </p>
        </div> -->

        <div
          class="flex items-center bg-gray-300 rounded rounded-t-none border boreder-gray-500 px-1 gap-2">
          <UIcon v-if="data.state == 'Created'" name="mingcute:sleep-fill" />
          <UIcon v-if="data.state == 'Running'" name="eos-icons:loading" />
          <UIcon
            v-if="data.state == 'Ended'"
            name="material-symbols:done-all" />
        </div>

        <div
          :class="{
            'bg-emerald-400': data.level == 1,
            'bg-amber-400': data.level == 2,
            'bg-indigo-400': data.level == 3,
            'bg-cyan-400': data.level == 4,
          }"
          class="flex items-center rounded rounded-t-none border boreder-gray-500 px-1 gap-2">
          <!-- <UIcon name="material-symbols:table-restaurant" class="text-xl" /> -->
          <p class="text-white">
            المستوي
            {{ data.level }}
          </p>
        </div>

        <div
          v-if="data.qydhaGameId"
          class="h-full items-center flex justify-center">
          <UIcon
            name="material-symbols:info"
            class="text-xl text-green-400 cursor-pointer"
            @click="onClick" />
        </div>
        <div
          class="flex items-center bg-gray-300 rounded rounded-t-none border boreder-gray-500 px-1 gap-2">
          <UIcon name="material-symbols:table-restaurant" class="text-xl" />
          <p>
            {{ data.tableNumber }}
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
import type { Match } from "~/models/group";
import StatusModal from "./StatusModal.vue";
const props = defineProps<{ data: Match }>();
const modal = useModal();
const onClick = () => {
  if (props.data.qydhaGameId) {
    modal.open(StatusModal, {
      m: props.data,
      onSuccess() {
        modal.close();
      },
    });
  }
};
</script>

<style></style>
