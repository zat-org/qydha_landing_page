<template>
  
  
  <ClientOnly>
    <div class="bracket-container bg-gray-50 dark:bg-gray-950">
 

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
        <!-- <Background /> -->
        <template #node-match="matchProps">
          <MatchNode v-bind="matchProps" />
        </template>
      </VueFlow>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed } from "vue";
import type { Group } from "@/features/tournament/models/group";
import { useMyTournamentStore } from "~/features/tournament/core/stores/tournament";

const VueFlow = defineAsyncComponent(() => import("@vue-flow/core").then((m) => m.VueFlow));
const MatchNode = defineAsyncComponent(() => import("./MatchNode.vue"));

const props = defineProps<{ group: Group }>();

const tourStore = useMyTournamentStore();
const { layoutFromMatchesTree } = useLayout();
const { matchesTree, loserMatches, games } = storeToRefs(tourStore);

const direction = computed(() => {
  return ((props.group.type.toLowerCase() == "final" && games.value.length > 32) || (loserMatches.value?.length && loserMatches.value.length > 0))
    ? "LRC"
    : "LR";
});

const OrderedNodes = computed(() => {
  if (matchesTree.value === undefined || loserMatches.value === undefined) {
    return undefined;
  }
  return layoutFromMatchesTree(
    matchesTree.value,
    loserMatches.value,
    direction.value,
  );
});
</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.bracket-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
}

.bracket-flow {
  width: 100%;
  height: 100%;
}

/* Vue Flow default theme uses a light canvas — match bracket in dark mode */
html.dark .bracket-container .vue-flow {
  background-color: rgb(3 7 18);
}

/* OBS overlay: keep canvas transparent for chroma/stream */
html.bracket-obs .bracket-container,
html.bracket-obs .bracket-container .vue-flow {
  background-color: transparent !important;
}

.bracket-logo-theme {
  position: absolute;
  top: 45px;
  left: 16px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.bracket-logo {
  width: 80px;
  pointer-events: none;
}

.theme-toggle-btn {
  transition: background 0.2s, color 0.2s;
  outline: none;
  cursor: pointer;
  width: 80px;
  direction: rtl;
}

.theme-toggle-btn:focus {
  box-shadow: 0 0 0 2px #f59e0b66;
}
</style>
