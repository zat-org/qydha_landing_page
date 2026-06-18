<template>
  <div class="mt-4 ">
    <section
      class="rounded-2xl border border-gray-200/90 bg-linear-to-b from-white/95 to-gray-50/70 p-4 shadow-md shadow-gray-900/5 ring-1 ring-gray-200/60 dark:border-gray-800 dark:from-gray-950/50 dark:to-gray-950/80 dark:shadow-none dark:ring-gray-800/80 sm:p-6"
      aria-label="المرحلة الحالية"
    >
      <div
        class="flex flex-wrap items-center gap-3 border-b border-gray-200/80 pb-3 dark:border-gray-800/80"
      >
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"
        >
          <UIcon name="i-mdi-flag-checkered" class="size-6" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
            المرحلة الحالية — ماذا تفعل الآن؟
          </p>
          <p
            v-if="phaseView.label"
            class="mt-1 text-sm font-semibold text-gray-900 dark:text-white"
          >
            {{ phaseView.label }}
          </p>
        </div>
      </div>

      <TournamentPhasePanel
        :context="phaseContext"
        :phase-view="phaseView"
        @refreshed="emit('refreshed')"
      />

      <TournamentGetExternalLinks
        :tournament-id="id"
        :tabs="phaseView.externalTabs"
      />

      <TournamentOutlet
        :tournament-id="id"
        :outlets="phaseView.outlets"
        @done="emit('refreshed')"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { GroupState } from '~/features/tournament/models/group';
import type {
  TournamentDetailedState,
  TournamentState,
} from '~/features/tournament/models/tournament';
import { resolvePhaseView } from '~/features/tournament/core/utils';
import TournamentPhasePanel from './phases/TournamentPhasePanel.vue';
import TournamentGetExternalLinks from './TournamentGetExternalLinks.vue';
import TournamentOutlet from './TournamentOutlet.vue';
import type { TournamentPhaseContext } from '~/features/tournament/core/types';

const props = defineProps<{
  id: string;
  detailedState: TournamentDetailedState | undefined;
  isAdmin: boolean;
  tournamentState?: TournamentState;
  finalGroupState?: GroupState;
  hasQualificationsStage?: boolean | null;
}>();

const emit = defineEmits<{ refreshed: [] }>();

const phaseContext = computed<TournamentPhaseContext>(() => ({
  tournamentId: props.id,
  isAdmin: props.isAdmin,
  detailedState: props.detailedState,
  tournamentState: props.tournamentState,
  finalGroupState: props.finalGroupState,
  hasQualificationsStage: props.hasQualificationsStage,
}));

const phaseView = computed(() => resolvePhaseView(phaseContext.value));
</script>
