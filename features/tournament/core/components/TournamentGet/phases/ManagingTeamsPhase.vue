<template>
  <TournamentPhaseContent
    heading="إعداد الفرق"
    description="أضف الفرق واللاعبين، ثم ابدأ تنظيم البطولة للانتقال لمرحلة ربط الفرق بالمجموعة النهائية."
  >
    <UButton
      :to="links.team.value"
      label="إدارة الفرق واللاعبين"
      icon="i-mdi-account-group"
      size="lg"
      variant="solid"
      color="primary"
      class="w-full min-h-12 justify-center sm:min-w-[14rem] sm:flex-1"
      block
    />
    <UButton
      v-if="showOrganizeButton"
      label="بدء تنظيم البطولة"
      icon="i-mdi-tournament"
      size="lg"
      variant="outline"
      class="w-full min-h-12 justify-center sm:w-auto"
      :loading="setupPending"
      block
      @click="handleOrganizeTournament"
    />
  </TournamentPhaseContent>
</template>

<script lang="ts" setup>
import { GroupState } from "~/features/tournament/models/group";
import {
  TournamentDetailedState,
  TournamentState,
} from "~/features/tournament/models/tournament";
import SetupTournamentModal from "~/features/tournament/core/components/SetupTournamentModal.vue";
import TournamentPhaseContent from "./TournamentPhaseContent.vue";
import type { TournamentPhaseContext } from "./types";
import { useTournamentPhaseLinks } from "./useTournamentPhaseLinks";

const props = defineProps<{ context: TournamentPhaseContext }>();
const emit = defineEmits<{ refreshed: [] }>();

const links = useTournamentPhaseLinks(() => props.context.tournamentId);
const toast = useToast();
const overlay = useOverlay();
const setupModal = overlay.create(SetupTournamentModal);
const { setupTournament } = useTournament();
const setupReq = setupTournament(props.context.tournamentId);

const setupPending = computed(
  () => setupReq.result.status.value === "pending",
);

const showOrganizeButton = computed(
  () =>
    props.context.detailedState === TournamentDetailedState.ManagingTeams &&
    props.context.finalGroupState === GroupState.Created &&
    props.context.hasQualificationsStage == null &&
    props.context.tournamentState === TournamentState.Upcoming,
);

const handleOrganizeTournament = async () => {
  const instance = setupModal.open();
  const confirmed = await instance.result;
  if (!confirmed) return;

  await setupReq.fetchREQ(confirmed);
  if (setupReq.result.status.value === "success") {
    emit("refreshed");
  } else {
    toast.add({
      title: "تعذّر تنظيم البطولة",
      color: "error",
    });
  }
};
</script>
