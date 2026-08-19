<template>
  <TournamentPhaseContent
    :heading="phaseConfig.ui.heading"
    :description="phaseConfig.ui.description"
    :alert="phaseConfig.ui.alert"
  >
    <UButton
      v-for="action in visibleActions"
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

  <component
    :is="phaseConfig.view"
    v-if="phaseConfig.view"
    class="mt-4"
    :tournament-id="context.tournamentId"
    @done="emit('refreshed')"
  />
</template>

<script lang="ts" setup>
import TournamentApprovePlanConfirmModal from "../../shared/TournamentApprovePlanConfirmModal.vue";
import TournamentStartConfirmModal from "../../shared/TournamentStartConfirmModal.vue";
import TournamentPhaseContent from "./TournamentPhaseContent.vue";
import type {
  PhaseAction,
  PhaseStateConfig,
  TournamentPhaseContext,
} from "~/features/tournament/detail/types/phase.types";

const props = defineProps<{
  context: TournamentPhaseContext;
  phaseConfig: PhaseStateConfig;
  visibleActions: PhaseAction[];
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
} = useTournamentPhaseActions(props.context.tournamentId, () =>
  emit("refreshed"),
);
</script>
