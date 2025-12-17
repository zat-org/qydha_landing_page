<template>
  <ClientOnly>
    <div class="bracket-container">
      <!-- Logo overlay with theme toggle button positioned under image -->
      <div class="bracket-logo-theme">
        <img
          :src="QydhaLogo"
          alt="Qydha logo"
          class="bracket-logo"
        />
        <button
          @click="toggleTheme"
          class="theme-toggle-btn px-3 py-1 mt-2 rounded border text-xs font-semibold"
          :class="isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-300'"
          aria-label="تبديل الثيم"
        >
          <template v-if="isDark">
            ☀️
          </template>
          <template v-else>
            🌙
          </template>
        </button>
      </div>

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
import { defineAsyncComponent, computed } from 'vue';
import type { Group } from "@/models/group";
import { useMyTournamentStore } from "@/store/tournament";
import QydhaLogo from "@/assets/images/qydha-logo.svg";
import { useColorMode } from '@vueuse/core';

// Lazy load Vue Flow components
const VueFlow = defineAsyncComponent(() => import('@vue-flow/core').then(m => m.VueFlow));
const Background = defineAsyncComponent(() => import('@vue-flow/background').then(m => m.Background));
const MatchNode = defineAsyncComponent(() => import('../Bracket/MatchNode.vue'));

const props = defineProps<{ group: Group }>();

const tourStore = useMyTournamentStore();
const { layoutFromMatchesTree } = useLayout();

const { matchesTree, loserMatches, games } = storeToRefs(tourStore);

// Theme toggler using composable
const colorMode = useColorMode({
  emitAuto: true,
  selector: 'html',
});
const isDark = computed(() => colorMode.value === 'dark');

function toggleTheme() {
  colorMode.value = isDark.value ? 'light' : 'dark';
}

const direction = computed(() => {
  return (
    (props.group.type.toLowerCase() == 'final' && games.value.length > 32) ||
    (loserMatches.value?.length && loserMatches.value.length > 0)
  )
    ? "LRC"
    : "LR";
});

const OrderedNodes = computed(() => {
  if (!matchesTree.value || !loserMatches.value) return undefined;
  return layoutFromMatchesTree(matchesTree.value, loserMatches.value, direction.value);
});

onUnmounted(() => {
  tourStore.closeConnection();
});
</script>

<style>
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