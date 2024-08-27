<template>
  <div>
    <Handle type="target" :position="Position.Left" style="opacity: 0" />
    <div class="flex flex-col w-[200px] h-[50px] text-xs font-semibold">
      <p
        class="px-2 bg-gray-300 rounded border boreder-gray-500 text-center h-10">
        {{ data.usTeam?.id }}-{{ data.usTeam?.name }}
      </p>
      <p
        class="px-2 bg-gray-300 rounded border boreder-gray-500 text-center h-10">
        {{ data.usTeam?.id }}- {{ data.themTeam?.name }}
      </p>
      <p
        class="px-2 bg-gray-300 rounded border boreder-gray-500 text-center h-10">
        {{ data.tableNumber }}
      </p>
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
