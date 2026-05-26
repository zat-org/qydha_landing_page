<template>
  <TournamentPhaseContent
    :alert="{
      color: 'success',
      title: 'البطولة جارية',
      description: 'تابع المباريات من الخريطة أو حدّث النتائج حسب صلاحياتك.',
    }"
  >
    <UButton
      v-if="context.isAdmin"
      label="انهاء البطولة"
      icon="i-mdi-trophy"
      size="lg"
      variant="soft"
      color="primary"
      class="w-full min-h-12 justify-center sm:w-auto"
      :loading="finishPending"
      block
      @click="handleFinish"
    />
  </TournamentPhaseContent>
</template>

<script lang="ts" setup>
import TournamentPhaseContent from './TournamentPhaseContent.vue';
import type { TournamentPhaseContext } from './types';

const props = defineProps<{ context: TournamentPhaseContext }>();
const emit = defineEmits<{ refreshed: [] }>();

const toast = useToast();
const finishReq = await useTournament().finishTournament();

const finishPending = computed(() => finishReq.status.value === 'pending');

const handleFinish = async () => {
  await finishReq.fetchREQ(props.context.tournamentId);
  if (finishReq.status.value === 'success') {
    toast.add({
      title: 'تم انهاء البطولة',
      description: 'تم انهاء البطولة بنجاح',
      color: 'success',
    });
    emit('refreshed');
  } else if (finishReq.error.value?.data?.code === 'InvalidTournamentOperation') {
    toast.add({
      title: 'تعذّر انهاء البطولة',
      description: 'لا يمكن انهاء البطولة الا بعد انهاء كل المباريات',
      color: 'error',
    });
  }
};
</script>
