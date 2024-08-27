<template>
  <div>
    <Handle type="target" :position="Position.Left" style="opacity: 0" />
    <div class="flex flex-col w-[300px] h-[75px] text-xs font-semibold bg-white p-1  rounded">
      <div
      :class="{'bg-green-300':data.winner=='us','bg-red-300':data.winner && data.winner!=='us'}"
        class="flex justify-between items-center pe-1  bg-gray-300 rounded  rounded-b-none border boreder-gray-500 h-10 w-full">

        <!-- <UBadge v-if="data.usTeamId" color="sky" :label="data.usTeamId"></UBadge> -->

        <div class="border-e-2 w-[30px] h-full border-gray-900 text-center  flex justify-center items-center  bg-gray-300">
          <p >
            {{ data.usTeamId }}
          </p>
        </div>
        <p class="grow text-center">{{ data.usTeam?.name }}</p>
      </div>

      <div
        :class="{'bg-green-300':data.winner=='them','bg-red-300': data.winner && data.winner!=='them'}"
        class="flex justify-between items-center pe-1 bg-gray-300  border boreder-gray-500 text-center h-10 w-full">


        <div class="border-e-2 w-[30px] h-full border-gray-900 text-center  flex justify-center items-center  bg-gray-300">
          <p >
            {{ data.themTeamId }}
          </p>
        </div>


    
        <p class="grow text-center">{{ data.themTeam?.name }}</p>
      </div>
      <div
        class="flex justify-between text-center h-7">
<!--    
        <div class="flex items-center  bg-gray-300 rounded rounded-t-none border boreder-gray-500 px-1 gap-2  ">
          <UIcon name="mingcute:time-line" class="text-xl" />
          <p >
            {{ new Date(data.startAt).toLocaleString()  }}
          </p>
        </div> -->

        <div class="flex items-center bg-gray-300 rounded  rounded-t-none border boreder-gray-500 px-1  gap-2">
          <UIcon name="mingcute:sleep-fill" vif="true"/>
        
        </div>

        <div class="flex items-center bg-gray-300 rounded  rounded-t-none border boreder-gray-500 px-1  gap-2">
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
const props = defineProps<{ data: Match }>();
</script>

<style></style>
