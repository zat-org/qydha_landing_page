<template>
  <div
    class="bracket-container"
    :class="{
      'bg-gray-50 dark:bg-gray-950': !obsMode,
      'bracket-container--obs': obsMode,
    }"
  >
    <VueFlow
      v-if="OrderedNodes"
      :nodes="OrderedNodes.nodes"
      :edges="OrderedNodes.edges"
      :min-zoom="0.2"
      :max-zoom="4"
      :class="['bracket-flow', { 'bracket-flow--obs': obsMode }]"
      @init="onFlowInit"
      @nodes-initialized="scheduleFit"
    >
      <template #node-match="matchProps">
        <MatchNode v-bind="matchProps" />
      </template>
    </VueFlow>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, nextTick } from "vue";
import { VueFlow, type VueFlowStore } from "@vue-flow/core";
import type { Group } from "@/features/tournament/models/group";
import { useTournamentBracketStore } from "~/features/tournament/bracket/stores";
import MatchNode from "./MatchNode.vue";
import { useLayout } from "~/features/tournament/bracket/composables/useLayout";

const props = defineProps<{ group: Group; obsMode?: boolean }>();

provide(
  "bracketObsMode",
  computed(() => !!props.obsMode),
);

const tourStore = useTournamentBracketStore();
const { layoutFromMatchesTree } = useLayout();
const { matchesTree, loserMatches, games, myMatchId, myMatchFocusNonce } =
  storeToRefs(tourStore);

let flow: VueFlowStore | null = null;
let lastHandledFocusNonce = 0;

const direction = computed(() => {
  return ((props.group.type.toLowerCase() == "final" && games.value.length > 32) || (loserMatches.value?.length && loserMatches.value.length > 0))
    ? "LRC"
    : "LR";
});

const OrderedNodes = computed(() => {
  if (matchesTree.value === undefined || loserMatches.value === undefined) {
    return undefined;
  }
  const layout = layoutFromMatchesTree(
    matchesTree.value,
    loserMatches.value,
    direction.value,
    props.obsMode,
  );

  if (!props.obsMode) return layout;

  return {
    ...layout,
    edges: layout.edges.map((edge) => ({
      ...edge,
      style: { strokeWidth: 5 },
    })),
  };
});

function onFlowInit(instance: VueFlowStore) {
  flow = instance;
  void scheduleFit();
}

function fitAll(duration = 300) {
  flow?.fitView({
    padding: 0.2,
    includeHiddenNodes: false,
    duration,
  });
}

function zoomToMatch(matchId: string) {
  if (!flow) return;
  const node = flow.findNode(matchId);
  if (!node) {
    fitAll();
    return;
  }

  const width = node.dimensions?.width || 450;
  const height = node.dimensions?.height || 100;
  flow.setCenter(node.position.x + width / 2, node.position.y + height / 2, {
    zoom: 1,
    duration: 400,
  });
}

function focusTargetMatchId() {
  const matchId = myMatchId.value;
  if (!matchId || props.obsMode) return undefined;
  const exists = OrderedNodes.value?.nodes.some(
    (node) => node.id === String(matchId),
  );
  return exists ? String(matchId) : undefined;
}

async function scheduleFit() {
  if (!flow || !OrderedNodes.value?.nodes?.length) return;

  await nextTick();

  const matchId = focusTargetMatchId();
  const shouldFocus =
    !!matchId && myMatchFocusNonce.value > lastHandledFocusNonce;

  requestAnimationFrame(() => {
    if (shouldFocus && matchId) {
      lastHandledFocusNonce = myMatchFocusNonce.value;
      zoomToMatch(matchId);
      setTimeout(() => zoomToMatch(matchId), 160);
      return;
    }
    if (matchId && lastHandledFocusNonce === myMatchFocusNonce.value) {
      return;
    }
    fitAll(300);
  });

  if (!shouldFocus && !(matchId && lastHandledFocusNonce === myMatchFocusNonce.value)) {
    setTimeout(() => {
      fitAll(0);
    }, 120);
  }
}

watch(myMatchFocusNonce, () => {
  void scheduleFit();
});


watch(
  () => OrderedNodes.value?.nodes.length,
  () => {
    void scheduleFit();
  },
);
</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.bracket-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
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
html.bracket-obs .bracket-container .vue-flow,
html.bracket-obs .bracket-container .vue-flow__viewport,
html.bracket-obs .bracket-container .vue-flow__pane {
  background: transparent !important;
  background-color: transparent !important;
}

html.bracket-obs .bracket-container .vue-flow__edge-path {
  stroke-width: 5px !important;
}

html.bracket-obs .bracket-container .vue-flow__edge {
  stroke-width: 5px;
}

.bracket-flow--obs :deep(.vue-flow__edge-path) {
  stroke-width: 5px !important;
}

.bracket-flow--obs :deep(.vue-flow__edge) {
  stroke-width: 5px;
}

.bracket-logo-theme {
  position: absolute;
  top: calc(var(--bracket-header-height, 56px) + 8px);
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
