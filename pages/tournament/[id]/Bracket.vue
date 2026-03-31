<template>
  <div>
    <div class="w-full h-screen">
      <div class="flex flex-col   fixed top-0 left-0 right-0 z-50">

      <UButtonGroup orientation="horizontal" v-if="tourStore.tournament.length > 0" class="flex flex-wrap" >
        <UButton class="basis-[20px] grow" v-for="item in tourStore.tournament" :label="`${item.data.name}`"
          :color="tourStore.selectedGroup?.data.id == item.data.id ? 'success' : 'neutral'" block
          @click="handleGroupSelection(item.data.id.toString())" />
      </UButtonGroup>
      <div v-if="tourStore.rounds.length > 0 && isAdmin" class="flex flex-wrap items-center gap-2 p-2">
        <USelectMenu
          v-model="selectedRoundId"
          :items="tourStore.rounds"
          label-key="name"
          value-key="id"
          :search-attributes="['name']"
          class="w-[220px]"
          :placeholder="tourStore.selectedRound?.name || 'اختر الجولة'"
          @update:model-value="onRoundSelected"
        />

        <UButton
          icon="i-heroicons-pencil"
          color="warning"
          variant="soft"
          :disabled="!canEditSelectedRound"
          @click="openSelectedRoundEdit"
        >
          تعديل
        </UButton>

        <UButton
          icon="i-heroicons-x-mark"
          color="neutral"
          variant="soft"
          :disabled="!tourStore.selectedRound"
          @click="clearRoundSelection"
        >
          مسح
        </UButton>
      </div>
    </div>
      


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
  </div>
</template>

<script lang="ts" setup>
import { GroupState, type RoundGroupDetails } from '~/models/group';
import { TournamentState } from '~/models/tournament';
import { useMyTournamentStore } from '~/store/tournament';
import { useMyAuthStore } from '~/store/Auth';
import UpdateRoundDrawer from '~/components/Tournament/group/Round/UpdateRoundDrawer.vue';
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
const isAdmin = computed(() => {
  return user.value?.user.roles.includes("SuperAdmin") ||
    user.value?.user.roles.includes("StaffAdmin")
});

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
onMounted(async () => {
  await tourStore.initStore()
})



const handleGroupSelection = (group_id: string) => {
  useRouter().push({ path: useRoute().path, query: { group: group_id } });
};

const roundBeingEdited = ref<RoundGroupDetails['rounds'][0] | null>(null);
const updateRoundDrawer = useTemplateRef<any>('updateRoundDrawer');

const selectedRoundId = ref<string | undefined>(tourStore.selectedRound?.id);

watch(
  () => tourStore.selectedRound?.id,
  (id) => {
    selectedRoundId.value = id;
  }
);

const onRoundSelected = (id?: string) => {
  if (!id) return;
  tourStore.handleRoundSelection(id);
};

const clearRoundSelection = () => {
  // store toggles off if you pass the currently selected id
  if (tourStore.selectedRound?.id) {
    tourStore.handleRoundSelection(tourStore.selectedRound.id);
  }
  selectedRoundId.value = undefined;
};

const canEditSelectedRound = computed(() => {
  return Boolean(isAdmin.value && tourStore.selectedGroup && tourStore.selectedRound?.id && tourStore.tournamentDashboard?.state == TournamentState.Upcoming);
});

const openSelectedRoundEdit = () => {
  const roundId = tourStore.selectedRound?.id;
  if (!roundId) return;
  const round = tourStore.rounds.find(r => r.id === roundId) || null;
  if (!round || !tourStore.selectedGroup) return;

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
    await tourStore.refreshRounds(tourid, newGroupId);
  }
);
</script>

<style></style>