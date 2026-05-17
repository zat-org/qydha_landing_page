<template>
  <TournamentPhaseContent
    :alert="{
      color: 'info',
      title: 'جاهز للبدء',
      description: 'تمت الموافقة على المخطط — راجع الخريطة ثم ابدأ البطولة عندما تكون جاهزاً.',
    }"
  >
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
      
      label="بدء البطولة"
      icon="i-mdi-play"
      size="lg"
      variant="solid"
      color="primary"
      class="w-full min-h-12 justify-center sm:w-auto"
      :loading="startPending"
      block
      @click="startConfirmOpen = true"
    />

    <TournamentGetStartConfirmModal
      v-model:open="startConfirmOpen"
      :pending="startPending"
      @confirm="confirmStart"
    />
  </TournamentPhaseContent>
</template>

<script lang="ts" setup>
import { GroupState } from "~/features/tournament/models/group";
import { TournamentState } from "~/features/tournament/models/tournament";
import TournamentGetStartConfirmModal from "../TournamentGetStartConfirmModal.vue";
import TournamentPhaseContent from "./TournamentPhaseContent.vue";
import type { TournamentPhaseContext } from "./types";
import { useTournamentPhaseLinks } from "./useTournamentPhaseLinks";

const props = defineProps<{ context: TournamentPhaseContext }>();
const emit = defineEmits<{ refreshed: [] }>();

const links = useTournamentPhaseLinks(() => props.context.tournamentId);
const toast = useToast();
const startConfirmOpen = ref(false);
const startReq = await useTournament().startFinalGroupTournament(
  props.context.tournamentId,
);

const startPending = computed(
  () => startReq.result.status.value === "pending",
);



const confirmStart = async () => {
  await startReq.fetchREQ();
  if (startReq.result.status.value === "success") {
    toast.add({
      title: "تم بدء المباريات في المجموعة النهائية",
      description: "تم بدء المباريات في المجموعة النهائية بنجاح",
      color: "success",
    });
    startConfirmOpen.value = false;
    emit("refreshed");
  } else {
    const err = startReq.result.error.value as
      | { message?: string }
      | null
      | undefined;
    toast.add({
      title: "تعذّر بدء البطولة",
      description: err?.message ?? "تحقق من الاتصال وحاول مرة أخرى.",
      color: "error",
    });
  }
};
</script>
