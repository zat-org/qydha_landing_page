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

    <GenerateQualificationBracketsDrawer
      v-model:open="qualGenerateOpen"
      :tournament-id="context.tournamentId"
      :is-regenerate="isRegenerateQual"
      @success="onPhaseRefreshed"
    />

    <CreateMatchDrawer
      v-if="finalGroup"
      ref="finalCreateMatchDrawer"
      :group="finalGroup"
      @success="onPhaseRefreshed"
    />
  </TournamentPhaseContent>

  <TournamentLifecyclePanel
    :tournament-id="context.tournamentId"
    :lifecycle="phaseConfig.lifecycle"
    :summary="summary"
  />
</template>

<script lang="ts" setup>
import TournamentApprovePlanConfirmModal from "../../shared/TournamentApprovePlanConfirmModal.vue";
import TournamentStartConfirmModal from "../../shared/TournamentStartConfirmModal.vue";
import GenerateQualificationBracketsDrawer from "~/features/tournament/detail/components/GenerateQualificationBracketsDrawer.vue";
import CreateMatchDrawer from "~/features/tournament/group/components/CreateMatchDrawer.vue";
import TournamentPhaseContent from "./TournamentPhaseContent.vue";
import TournamentLifecyclePanel from "../lifecycle/TournamentLifecyclePanel.vue";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import type {
  PhaseAction,
  PhaseStateConfig,
  TournamentPhaseContext,
} from "~/features/tournament/detail/types/phase.types";
import type { TournamentLifecycleSummary } from "~/features/tournament/detail/composables/logic/useTournamentLifecycleSummary";
import { useTournamentPhaseActions } from "~/features/tournament/detail/composables/logic/useTournamentPhaseActions";

const props = defineProps<{
  context: TournamentPhaseContext;
  phaseConfig: PhaseStateConfig;
  visibleActions: PhaseAction[];
  summary: TournamentLifecycleSummary;
}>();

const emit = defineEmits<{ refreshed: [] }>();

const isRegenerateQual = computed(
  () =>
    props.context.detailedState ===
    TournamentDetailedState.ManagingQualificationStageBrackets,
);

const finalGroup = computed(() => unref(props.summary.finalGroup));

const finalCreateMatchDrawer =
  useTemplateRef<InstanceType<typeof CreateMatchDrawer>>("finalCreateMatchDrawer");

const {
  approveConfirmOpen,
  startConfirmOpen,
  qualGenerateOpen,
  finalGenerateOpen,
  approvePending,
  startPending,
  pendingByAction,
  runAction,
  confirmApprovePlan,
  confirmStart,
} = useTournamentPhaseActions(props.context.tournamentId, () =>
  onPhaseRefreshed(),
);

watch(finalGenerateOpen, async (open) => {
  if (!open) return;
  await nextTick();
  if (finalCreateMatchDrawer.value) {
    finalCreateMatchDrawer.value.open = true;
  } else {
    useToast().add({
      title: "المجموعة النهائية غير متاحة",
      description: "تأكد من إنشاء المجموعة النهائية ثم أعد المحاولة.",
      color: "warning",
    });
  }
  finalGenerateOpen.value = false;
});

watch(
  () => finalCreateMatchDrawer.value?.open,
  (open) => {
    if (open === false) finalGenerateOpen.value = false;
  },
);

async function onPhaseRefreshed() {
  await props.summary.refresh();
  emit("refreshed");
}
</script>
