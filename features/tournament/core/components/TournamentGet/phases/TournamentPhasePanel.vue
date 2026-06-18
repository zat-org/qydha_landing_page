<template>
  <TournamentPhaseContent
    :heading="phaseView.ui.heading"
    :description="phaseView.ui.description"
    :alert="phaseView.ui.alert"
  >
    <UButton
      v-for="action in phaseView.actions"
      :key="action.id"
      :label="action.label"
      :icon="action.icon"
      size="lg"
      :variant="action.variant ?? 'solid'"
      :color="action.color ?? 'primary'"
      class="w-full min-h-12 justify-center sm:w-auto"
      :loading="pendingByAction[action.id]"
      block
      @click="runAction(action)"
    />

    <TournamentApprovePlanConfirmModal
      v-model:open="approveConfirmOpen"
      :pending="approvePending"
      @confirm="confirmApprovePlan"
    />

    <TournamentStartConfirmModal
      v-model:open="startConfirmOpen"
      :pending="startPending"
      @confirm="confirmStart"
    />
  </TournamentPhaseContent>
</template>

<script lang="ts" setup>
import TournamentApprovePlanConfirmModal from '../../shared/TournamentApprovePlanConfirmModal.vue';
import TournamentStartConfirmModal from '../../shared/TournamentStartConfirmModal.vue';
import TournamentPhaseContent from './TournamentPhaseContent.vue';
import { useTournamentPhaseActions } from '~/features/tournament/core/composables/useTournamentPhaseActions';
import type {
  ResolvedPhaseView,
  TournamentPhaseContext,
} from '~/features/tournament/core/types';

const props = defineProps<{
  context: TournamentPhaseContext;
  phaseView: ResolvedPhaseView;
}>();

const emit = defineEmits<{ refreshed: [] }>();

const {
  approveConfirmOpen,
  startConfirmOpen,
  approvePending,
  startPending,
  pendingByAction,
  runAction,
  confirmApprovePlan,
  confirmStart,
} = useTournamentPhaseActions(
  props.context.tournamentId,
  () => emit('refreshed'),
);
</script>
