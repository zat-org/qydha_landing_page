<template>
  <VueFlow v-if="OrderedNodes" :nodes="OrderedNodes.nodes" :fit-view-on-init="true" :edges="OrderedNodes.edges"
    :default-zoom="1" :min-zoom="0.2" :max-zoom="4">
    <Background />
    <template #node-match="matchProps">
      <MatchNode v-bind="matchProps" />
    </template>
  </VueFlow>
</template>

<script lang="ts" setup>
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import MatchNode from "./MatchNode.vue";
import type { Group } from "~/models/group";
const props = defineProps<{ group: Group }>();
const direction = computed(() => props.group.isFinalGroup ? "LRC" : "LR");

// const { fitView, onNodesChange } = useVueFlow();
const { layoutFromMatchesTree } = useLayout()
const groupApi = useGroup();
const { matchesTree, fetchREQ, loserMatches } = await groupApi.getGroupMatches();

onMounted(async () => {
  await fetchREQ(props.group.id);
});

// onNodesChange(() => {
//   fitView({ duration: 1000 });
// })

watch(() => props.group.id, async (new_value) => {
  await fetchREQ(new_value);
});

const OrderedNodes = computed(() => {
  if (!matchesTree.value || !loserMatches.value) return undefined;
  return layoutFromMatchesTree(matchesTree.value, loserMatches.value, direction.value);
})
</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
</style>
