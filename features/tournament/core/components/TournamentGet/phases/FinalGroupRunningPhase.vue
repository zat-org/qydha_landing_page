<template>
  <TournamentPhaseContent
    :alert="{
      color: 'success',
      title: 'البطولة جارية',
      description: 'تابع المباريات من الخريطة أو حدّث النتائج حسب صلاحياتك.',
    }"
  >
    <UButton
      :to="links.group.value"
      label="المجموعات والمباريات"
      icon="i-mdi-user-group"
      size="lg"
      variant="soft"
      class="w-full min-h-12 justify-center sm:flex-1"
      block
    />
    <UButton
      :to="links.bracket.value"
      label="خريطة البطولة"
      icon="i-mdi-tournament"
      target="_blank"
      size="lg"
      variant="solid"
      color="primary"
      class="w-full min-h-12 justify-center sm:flex-1"
      block
    />
    <UButton
      :to="links.statistics.value"
      label="إحصائيات البطولة"
      icon="i-mdi-chart-box"
      target="_blank"
      size="lg"
      variant="soft"
      class="w-full min-h-12 justify-center sm:flex-1"
      block
    />
    <!-- <UButton
      v-if="context.isAdmin"
      label="إعادة ضبط مرحلة الخريطة"
      icon="i-mdi-backup-restore"
      size="lg"
      variant="soft"
      color="warning"
      class="w-full min-h-12 justify-center sm:w-auto"
      :loading="resetPending"
      block
      @click="handleReset"
    /> -->
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
import TournamentPhaseContent from "./TournamentPhaseContent.vue";
import type { TournamentPhaseContext } from "./types";
import { useTournamentPhaseLinks } from "./useTournamentPhaseLinks";

const props = defineProps<{ context: TournamentPhaseContext }>();
const emit = defineEmits<{ refreshed: [] }>();

const links = useTournamentPhaseLinks(() => props.context.tournamentId);
const toast = useToast();
const resetReq = await useTournament().resetFinalGroupMatches(
  props.context.tournamentId,
);
const finishReq = await useTournament().finishTournament();

const resetPending = computed(
  () => resetReq.result.status.value === "pending",
);
const finishPending = computed(() => finishReq.status.value === "pending");

const handleReset = async () => {
  await resetReq.fetchREQ();
  if (resetReq.result.status.value === "success") {
    toast.add({
      title: "تم إعادة ضبط المرحلة",
      description:
        "يمكنك الآن إدارة الخريطة والمباريات من مرحلة إدارة المجموعة النهائية.",
      color: "success",
    });
    emit("refreshed");
  } else {
    const code = resetReq.result.error.value?.data?.code;
    if (code === "InvalidTournamentOperation") {
      toast.add({
        title: "تعذّر إعادة الضبط",
        description: "لا يمكن اعادة ضبط الخريطة وقد تم بدء اللعب",
        color: "error",
      });
    }
  }
};

const handleFinish = async () => {
  await finishReq.fetchREQ(props.context.tournamentId);
  if (finishReq.status.value === "success") {
    toast.add({
      title: "تم انهاء البطولة",
      description: "تم انهاء البطولة بنجاح",
      color: "success",
    });
    emit("refreshed");
  } else if (finishReq.error.value?.data?.code === "InvalidTournamentOperation") {
    toast.add({
      title: "تعذّر انهاء البطولة",
      description: "لا يمكن انهاء البطولة الا بعد انهاء كل المباريات",
      color: "error",
    });
  }
};
</script>
