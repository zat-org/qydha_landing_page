<template>
  <TournamentPhaseContent
    description="ولّد المباريات وراجع الخريطة قبل الموافقة على المخطط وبدء اللعب."
  >
    <UButton
      v-if="showApprovePlan"
      label="الموافقة على مخطط البطولة"
      icon="i-mdi-check-decagram"
      size="lg"
      variant="solid"
      color="primary"
      class="w-full min-h-12 justify-center sm:w-auto"
      :loading="approvePending"
      block
      @click="approveConfirmOpen = true"
    />

    <TournamentGetApprovePlanConfirmModal
      v-model:open="approveConfirmOpen"
      :pending="approvePending"
      @confirm="confirmApprovePlan"
    />
  </TournamentPhaseContent>
</template>

<script lang="ts" setup>
import { GroupState } from '~/features/tournament/models/group';
import { TournamentState } from '~/features/tournament/models/tournament';
import TournamentGetApprovePlanConfirmModal from '../TournamentGetApprovePlanConfirmModal.vue';
import TournamentPhaseContent from './TournamentPhaseContent.vue';
import type { TournamentPhaseContext } from './types';

const props = defineProps<{ context: TournamentPhaseContext }>();
const emit = defineEmits<{ refreshed: [] }>();

const toast = useToast();
const approveConfirmOpen = ref(false);
const approveReq = await useTournament().approveTournamentPlan();

const approvePending = computed(() => approveReq.status.value === 'pending');

const showApprovePlan = computed(
  () =>
    props.context.isAdmin
    && props.context.tournamentState === TournamentState.Upcoming
    && props.context.finalGroupState === GroupState.MatchesGenerated,
);

const confirmApprovePlan = async () => {
  await approveReq.fetchREQ(props.context.tournamentId);
  if (approveReq.status.value === 'success') {
    toast.add({
      title: 'تمت الموافقة على مخطط البطولة',
      color: 'success',
    });
    approveConfirmOpen.value = false;
    emit('refreshed');
  } else {
    toast.add({
      title: 'تعذّرت الموافقة على المخطط',
      color: 'error',
    });
  }
};
</script>
