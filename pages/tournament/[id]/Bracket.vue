<template>
  <div>
    <div class="w-full h-screen">
      <BracketPageHeader
      v-if=" userStore.user && (userStore.isStaffAdmin || userStore.isSuperAdmin)"
      @regenerate-final-matches="openFinalGroupRegenerateDrawer"
      @open-start-confirm="openStartTournamentConfirm"
      @edit-round="onEditRoundFromHeader"
      @finish-tournament="finishTournament"
      @resume-final-group-after-finish="resumeFinalGroupAfterFinish"
      />
      <UButtonGroup  v-else-if="tourStore.tournament.length > 0" orientation="horizontal" class="flex flex-wrap">
      <UButton v-for="item in tourStore.tournament" :key="item.data.id" class="basis-[20px] grow"
        :label="`${item.data.name}`" block
        :color="tourStore.selectedGroup?.data.id == item.data.id ? 'success' : 'neutral'"
        @click="handleGroupSelection(item.data.id.toString())" />
    </UButtonGroup>
      
      
      <loading v-if=" tourStore.groupsREQ?.status && tourStore.groupsREQ?.status== 'pending'" />
      
      <ClientOnly>
        <Bracket v-if="tourStore.selectedGroup" :group="tourStore.selectedGroup.data" />
      </ClientOnly>

    </div>

    <UpdateRoundDrawer
    v-if="userStore.user && (userStore.isStaffAdmin || userStore.isSuperAdmin)"
      ref="updateRoundDrawer"
      :round="roundBeingEdited"
      :tour-id="tourid"
      :group-id="tourStore.selectedGroup?.data.id || ''"
    
    />

    <CreateMatchDrawer
      v-if="userStore.user && (userStore.isStaffAdmin || userStore.isSuperAdmin) && tourStore.selectedGroup"
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
import { useMyAuthStore } from '~/store/Auth';
const userStore = useMyAuthStore();

const route = useRoute();
const tourid = route.params.id.toString()

const tourStore = useMyTournamentStore();
const toast = useToast();

const createMatchDrawer = useTemplateRef<InstanceType<typeof CreateMatchDrawer>>("createMatchDrawer");

const startFinalGroupTournamentReq =  await  useTournament().startFinalGroupTournament(tourid);

const startTournamentConfirmOpen = ref(false);

const isStartFinalGroupPending = computed(
  () => startFinalGroupTournamentReq.result.status.value === "pending",
);

const handleGroupSelection = (group_id: string) => {
  useRouter().push({ path: useRoute().path, query: { group: group_id } });
};


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
    // await tourStore.refreshTournamentDashboard(tourid);
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
const finishReq = await useTournament().finishTournament();
const finishTournament = async () => {
  await finishReq.fetchREQ(tourid);
  if (finishReq.status.value == "success") {
    toast.add({
      title: "تم انهاء البطولة",
      description: "تم انهاء البطولة بنجاح",
      color: "success",
    });
  }else{

    toast.add({
      title: "تعذّر انهاء البطولة",
      description: "لا يمكن انهاء البطولة الا بعد انهاء كل المباريات  ",
      color: "error",
    })
  }

}
const resumeReq = await useTournament().resumeFinalGroupAfterFinish();
const resumeFinalGroupAfterFinish = async () => {
  await resumeReq.fetchREQ(tourid);
  if (resumeReq.status.value == "success") {
    toast.add({
      title: "تم استكمال البطولة",
      description: "تم استكمال البطولة بنجاح",
      color: "success",
    });
  } else {
    const err = resumeReq.error.value as { message?: string } | null | undefined;
    toast.add({
      title: "تعذّر استكمال البطولة",
      description: err?.message ?? "تحقق من الاتصال وحاول مرة أخرى.",
      color: "error",
    });
  }
}


const roundBeingEdited = ref<RoundGroupDetails['rounds'][0] | null>(null);
const updateRoundDrawer = useTemplateRef<any>('updateRoundDrawer');

const onEditRoundFromHeader = (round: RoundGroupDetails['rounds'][0]) => {
  roundBeingEdited.value = round;
  if (updateRoundDrawer.value) {
    updateRoundDrawer.value.open = true;
  }
};

// const onRoundUpdated = async () => {
//   const groupId = tourStore.selectedGroup?.data.id;
//   if (!groupId) return;
//   await tourStore.refreshRounds(tourid, groupId);
// };

// watch(
//   () => tourStore.selectedGroup?.data.id,
//   async (newGroupId, oldGroupId) => {
//     if (!newGroupId || newGroupId === oldGroupId) return;
//     roundBeingEdited.value = null;
//     if (updateRoundDrawer.value) {
//       updateRoundDrawer.value.open = false;
//     }
//     if (createMatchDrawer.value) {
//       createMatchDrawer.value.open = false;
//     }
//     await tourStore.refreshRounds(tourid, newGroupId);
//   }
// );
</script>

<style></style>