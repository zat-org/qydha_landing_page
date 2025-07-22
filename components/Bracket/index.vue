<template>
    <ClientOnly>
      <VueFlow v-if="OrderedNodes" :nodes="OrderedNodes.nodes" :fit-view-on-init="true" :edges="OrderedNodes.edges"
        :default-zoom="1" :min-zoom="0.2" :max-zoom="4">
        <Background />
        <template #node-match="matchProps">
          <MatchNode v-bind="matchProps" />
        </template>
      </VueFlow>
    </ClientOnly>
  </template>
  
  <script lang="ts" setup>
  import { defineAsyncComponent } from 'vue';
  import type { Group } from "@/models/group";
  import { useMyTournamentStore } from "@/store/tournament";
  
  // Lazy load Vue Flow components
  const VueFlow = defineAsyncComponent(() => import('@vue-flow/core').then(m => m.VueFlow));
  const Background = defineAsyncComponent(() => import('@vue-flow/background').then(m => m.Background));
  const MatchNode = defineAsyncComponent(() => import('../Bracket/MatchNode.vue'));
  
  const props = defineProps<{ group: Group }>();
  const direction = computed(() => props.group.type.toLowerCase() == 'final' ? "LRC" : "LR");
  const tourStore = useMyTournamentStore();
  const { layoutFromMatchesTree } = useLayout();
  
  const { matchesTree, loserMatches } = storeToRefs(tourStore);
  const OrderedNodes = computed(() => {
    if (!matchesTree.value || !loserMatches.value) return undefined;
    return layoutFromMatchesTree(matchesTree.value, loserMatches.value, direction.value);
  });
  
  onUnmounted(() => {
    tourStore.closeConnection();
  });
  </script>
  
  <style>
  /* Import styles only when component is loaded */
  @import "@vue-flow/core/dist/style.css";
  @import "@vue-flow/core/dist/theme-default.css";
  </style>