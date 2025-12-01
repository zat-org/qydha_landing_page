<template>
  <ClientOnly>
    <div class="bracket-container">
      <!-- Logo overlay inside the VueFlow area -->
      <img
        :src="QydhaLogo"
        alt="Qydha logo"
        class="bracket-logo"
      />

      <VueFlow
        v-if="OrderedNodes"
        :nodes="OrderedNodes.nodes"
        :fit-view-on-init="true"
        :edges="OrderedNodes.edges"
        :default-zoom="1"
        :min-zoom="0.2"
        :max-zoom="4"
        class="bracket-flow"
      >
        <Background />
        <template #node-match="matchProps">
          <MatchNode v-bind="matchProps" />
        </template>
      </VueFlow>
    </div>
  </ClientOnly>
</template>
  
  <script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import type { Group } from "@/models/group";
import { useMyTournamentStore } from "@/store/tournament";
import QydhaLogo from "@/assets/images/qydha-logo.svg";

// Lazy load Vue Flow components
const VueFlow = defineAsyncComponent(() => import('@vue-flow/core').then(m => m.VueFlow));
const Background = defineAsyncComponent(() => import('@vue-flow/background').then(m => m.Background));
const MatchNode = defineAsyncComponent(() => import('../Bracket/MatchNode.vue'));

const props = defineProps<{ group: Group }>();

const tourStore = useMyTournamentStore();
const { layoutFromMatchesTree } = useLayout();

const { matchesTree, loserMatches ,games} = storeToRefs(tourStore);
console.log(games.value)


const direction = computed(() => {
  console.log('group',props.group)
  return( props.group.type.toLowerCase() == 'final' && games.value.length > 32 || (loserMatches.value?.length && loserMatches.value.length > 0))   ? "LRC" : "LR"
}  );

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

.bracket-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.bracket-flow {
  width: 100%;
  height: 100%;
}

.bracket-logo {
  position: absolute;
  top: 45px;
  left: 16px;
  width: 80px;
  z-index: 10;
  pointer-events: none;
}
</style>