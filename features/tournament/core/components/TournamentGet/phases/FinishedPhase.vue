<template>
  <TournamentPhaseContent :alert="{ color: 'neutral', title: 'انتهت البطولة' }">
    <UButton
      :to="links.bracket.value"
      label="خريطة البطولة"
      icon="i-mdi-tournament"
      target="_blank"
      size="lg"
      variant="soft"
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
    <UButton
      v-if="context.isAdmin"
      label="استكمال البطولة"
      icon="i-mdi-check"
      size="lg"
      variant="soft"
      color="primary"
      class="w-full min-h-12 justify-center sm:w-auto"
      :loading="resumePending"
      block
      @click="handleResume"
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
const resumeReq = await useTournament().resumeFinalGroupAfterFinish();

const resumePending = computed(() => resumeReq.status.value === "pending");

const handleResume = async () => {
  await resumeReq.fetchREQ(props.context.tournamentId);
  if (resumeReq.status.value === "success") {
    toast.add({
      title: "تم استكمال البطولة",
      color: "success",
    });
    emit("refreshed");
  } else {
    const err = resumeReq.error.value as { message?: string } | null | undefined;
    toast.add({
      title: "تعذّر استكمال البطولة",
      description: err?.message ?? "تحقق من الاتصال وحاول مرة أخرى.",
      color: "error",
    });
  }
};
</script>
