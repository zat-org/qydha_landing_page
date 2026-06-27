<template>
  <div>
    <Handle type="target" :position="Position.Left" style="opacity: 0" />
    <MatchNodeObs v-if="obsMode" :data="data" />
    <MatchNodeNormal v-else :data="data" />
    <Handle type="source" :position="Position.Right" style="opacity: 0" />
  </div>
</template>

<script lang="ts" setup>
import { Position, Handle } from "@vue-flow/core";
import type { Match } from "@/features/tournament/models/group";
import MatchNodeNormal from "./MatchNodeNormal.vue";
import MatchNodeObs from "./MatchNodeObs.vue";

defineProps<{ data: { match: Match; showLogo?: boolean } }>();

const obsMode = inject<ComputedRef<boolean>>(
  "bracketObsMode",
  computed(() => false),
);
</script>

<style>
.dark {
  color-scheme: dark;
}
</style>
