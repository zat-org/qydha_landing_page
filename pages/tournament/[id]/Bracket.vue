<template>
  <div>
    <div class="w-full h-screen">
      <BracketPageHeader
        @regenerate-final-matches="openFinalGroupRegenerateDrawer"
        @open-start-confirm="openStartTournamentConfirm"
        @edit-round="onEditRoundFromHeader"
      />



      <loading v-if=" tourStore.groupsREQ?.status && tourStore.groupsREQ?.status== 'pending'" />
      <ClientOnly>
        <Bracket v-if="tourStore.selectedGroup" :group="tourStore.selectedGroup.data" />
      </ClientOnly>

    </div>

    <UpdateRoundDrawer
      ref="updateRoundDrawer"
      :round="roundBeingEdited"
      :tour-id="tourid"
      :group-id="tourStore.selectedGroup?.data.id || ''"
      @updated="onRoundUpdated"
    />

    <CreateMatchDrawer
      v-if="tourStore.selectedGroup"
      :key="tourStore.selectedGroup.data.id"
      ref="createMatchDrawer"
      :group="tourStore.selectedGroup.data"
      drawer-title="إعادة إنشاء مباريات النهائي"
      drawer-subtitle="اضبط الطاولات والمدة والإعدادات ثم احفظ — المجموعة:"
      @success="onCreateMatchDrawerSuccess"
    />

    <TournamentGetStartConfirmModal
      v-model:open="startTournamentConfirmOpen"
      :pending="isStartFinalGroupPending"
      @confirm="confirmAndStartTournament"
    />
  </div>
</template>

<script lang="ts" setup>
import { GroupType, type RoundGroupDetails } from "~/features/tournament/models/group";
import { useMyTournamentStore } from '~/features/tournament/core/stores/tournament';
import { Bracket, BracketPageHeader } from "~/features/tournament/bracket/components";
import UpdateRoundDrawer from "~/features/tournament/group/components/Round/UpdateRoundDrawer.vue";
import CreateMatchDrawer from "~/features/tournament/group/components/CreateMatchDrawer.vue";
import TournamentGetStartConfirmModal from "~/features/tournament/core/components/TournamentGet/TournamentGetStartConfirmModal.vue";

definePageMeta({
  layout: "custom",

});
useHead({
  title:'خريطة البطولة',
  meta:[
    {name:'description',content:'خريطة البطولة'}
  ]
})

const route = useRoute();
const tourid = route.params.id.toString()

const tourStore = useMyTournamentStore();
const toast = useToast();

const createMatchDrawer = useTemplateRef<InstanceType<typeof CreateMatchDrawer>>("createMatchDrawer");

const startFinalGroupTournamentReq = await useTournament().startFinalGroupTournament(tourid);

const startTournamentConfirmOpen = ref(false);

const isStartFinalGroupPending = computed(
  () => startFinalGroupTournamentReq.result.status.value === "pending",
);

const openStartTournamentConfirm = () => {
  if (tourStore.selectedGroup?.data.type !== GroupType.Final) return;
  startTournamentConfirmOpen.value = true;
};

const confirmAndStartTournament = async () => {
  await startFinalGroupTournamentReq.fetchREQ();
  if (startFinalGroupTournamentReq.result.status.value === "success") {
    toast.add({
      title: "تم بدء المباريات في المجموعة النهائية",
      description: "تم بدء المباريات في المجموعة النهائية بنجاح",
      color: "success",
    });
    startTournamentConfirmOpen.value = false;
    await tourStore.refreshTournamentDashboard(tourid);
    await tourStore.refreshBracket(tourid);
  } else {
    const err = startFinalGroupTournamentReq.result.error.value as { message?: string } | null | undefined;
    toast.add({
      title: "تعذّر بدء البطولة",
      description: err?.message ?? "تحقق من الاتصال وحاول مرة أخرى.",
      color: "error",
    });
  }
};

onMounted(async () => {
  await tourStore.initStore();
});

const openFinalGroupRegenerateDrawer = () => {
  if (tourStore.selectedGroup?.data.type !== GroupType.Final) return;
  const d = createMatchDrawer.value;
  if (d) d.open = true;
};

const onCreateMatchDrawerSuccess = async () => {
  await tourStore.refreshBracket(tourid);
};



const roundBeingEdited = ref<RoundGroupDetails['rounds'][0] | null>(null);
const updateRoundDrawer = useTemplateRef<any>('updateRoundDrawer');

const onEditRoundFromHeader = (round: RoundGroupDetails['rounds'][0]) => {
  roundBeingEdited.value = round;
  if (updateRoundDrawer.value) {
    updateRoundDrawer.value.open = true;
  }
};

const onRoundUpdated = async () => {
  const groupId = tourStore.selectedGroup?.data.id;
  if (!groupId) return;
  await tourStore.refreshRounds(tourid, groupId);
};

watch(
  () => tourStore.selectedGroup?.data.id,
  async (newGroupId, oldGroupId) => {
    if (!newGroupId || newGroupId === oldGroupId) return;
    roundBeingEdited.value = null;
    if (updateRoundDrawer.value) {
      updateRoundDrawer.value.open = false;
    }
    if (createMatchDrawer.value) {
      createMatchDrawer.value.open = false;
    }
    await tourStore.refreshRounds(tourid, newGroupId);
  }
);
</script>

<style></style>