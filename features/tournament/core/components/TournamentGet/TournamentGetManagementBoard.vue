<template>
  <div class="mt-4 px-4 pb-8 sm:px-6 lg:px-8">
    <section
      class="rounded-2xl border border-gray-200/90 bg-linear-to-b from-white/95 to-gray-50/70 p-4 shadow-md shadow-gray-900/5 ring-1 ring-gray-200/60 dark:border-gray-800 dark:from-gray-950/50 dark:to-gray-950/80 dark:shadow-none dark:ring-gray-800/80 sm:p-6"
      aria-label="المرحلة الحالية"
    >
      <div
        class="space-y-5 rounded-2xl border-2 border-primary/25 bg-linear-to-b from-primary/6 to-white/90 p-5 shadow-inner dark:border-primary/35 dark:from-primary/15 dark:to-gray-950/90 sm:p-6"
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
              v-if="detailedState"
              class="mt-1 text-sm font-semibold text-gray-900 dark:text-white"
            >
              {{ PHASE_LABELS_AR[detailedState] }}
            </p>
          </div>
        </div>

        <TournamentGetCurrentPhase
          :context="phaseContext"
          @refreshed="emit('refreshed')"
        />

        <TournamentGetExternalLinks
          :tournament-id="id"
          :detailed-state="detailedState"
        />

        <TournamentGetPhaseTabs
          :tournament-id="id"
          :detailed-state="detailedState"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { GroupState } from '~/features/tournament/models/group';
import type {
  TournamentDetailedState,
  TournamentState,
} from '~/features/tournament/models/tournament';
import { PHASE_LABELS_AR } from '~/features/tournament/core/composables/useTournamentDashboardPhase';
import TournamentGetCurrentPhase from './phases/TournamentGetCurrentPhase.vue';
import TournamentGetExternalLinks from './TournamentGetExternalLinks.vue';
import TournamentGetPhaseTabs from './TournamentGetPhaseTabs.vue';
import type { TournamentPhaseContext } from './phases/types';

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
</script>
