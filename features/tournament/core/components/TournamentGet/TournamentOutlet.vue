<template>
  <div
    v-if="outletViews.length"
    class="mt-4 border-t border-gray-200/80 pt-4 dark:border-gray-800/80"
  >
    <div v-if="outletViews.length === 1" class="min-h-[320px] py-2">
      <component
        :is="outletDef(outletViews[0]!).component"
        v-bind="outletDef(outletViews[0]!).props(outletContext)"
        @done="emit('done')"
      />
    </div>

    <UTabs
      v-else
      v-model="activeTab"
      :items="tabItems"
      :unmount-on-hide="false"
      dir="rtl"
      class="w-full min-w-0"
    >
      <template v-for="view in outletViews" :key="view" #[view]>
        <div class="min-h-[320px] py-2">
          <component
            :is="outletDef(view).component"
            v-bind="outletDef(view).props(outletContext)"
            @done="emit('done')"
          />
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import {
  buildOutletContext,
  buildOutletTabItems,
  getOutletRegistryEntry,
} from '~/features/tournament/core/utils';
import type { TournamentOutletView } from '~/features/tournament/core/types';

const props = defineProps<{
  tournamentId: string;
  outlets: TournamentOutletView[];
}>();

const emit = defineEmits<{ done: [] }>();

const outletContext = computed(() =>
  buildOutletContext(props.tournamentId),
);

const outletViews = computed(() => props.outlets);

const tabItems = computed(() => buildOutletTabItems(outletViews.value));

const activeTab = ref<TournamentOutletView>('team');

function outletDef(view: TournamentOutletView) {
  return getOutletRegistryEntry(view);
}

function syncActiveTabFromOutlets() {
  const views = outletViews.value;
  if (!views.length) return;
  activeTab.value = views.includes(activeTab.value) ? activeTab.value : views[0]!;
}

watch(outletViews, syncActiveTabFromOutlets, { immediate: true });
</script>
