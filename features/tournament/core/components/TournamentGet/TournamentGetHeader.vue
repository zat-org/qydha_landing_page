<template>
  <div class="flex flex-col gap-3 px-4 py-3.5 sm:px-8 sm:py-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <UButton label="عودة" color="neutral" variant="soft" size="sm" icon="i-mdi-arrow-right" @click="$emit('back')" />
      <div class="flex flex-wrap items-center justify-end gap-2">
        <USwitch :model-value="showInQydha" :loading="showInQydhaPending" :disabled="showInQydhaPending" size="md"
          label="عرض البطولة في قيدها" @update:model-value="onShowInQydhaChange" @click.stop />

        <UButton
          v-if="tournament.addPlayersByQydha"
          label="إعدادات طلبات الانضمام"
          icon="i-mdi-calendar-edit"
          color="primary"
          variant="soft"
          size="xs"
          class="min-h-9"
          @click="openJoinSettingsDrawer"
        />
        <UButton v-if="isAdmin" color="warning" label="تعديل" icon="i-mdi-pencil" size="sm"
          :to="`/tournament/${id}/edit`" />
        <UButton label="خريطة البطولة" :to="`/tournament/${id}/bracket`" icon="i-mdi-tournament" target="_blank"
          color="primary" variant="soft" size="sm" />
        <UButton label="إحصائيات البطولة" icon="i-mdi-chart-box" color="primary" variant="solid" size="sm"
          :to="`/tournament/${id}/statistics`" target="_blank" />
      </div>
    </div>

    <TournamentJoinRequestSettingsDrawer
      ref="joinSettingsDrawer"
      :tournament-id="id"
      :tournament="tournament"
      @success="emit('refreshed')"
    />
  </div>
</template>

<script lang="ts" setup>
import TournamentJoinRequestSettingsDrawer from "./TournamentJoinRequestSettingsDrawer.vue";
import type { DetailTournament } from "~/features/tournament/models/tournament";

const props = defineProps<{
  id: string;
  isAdmin: boolean;
  tournament: DetailTournament["tournament"];
}>();

const emit = defineEmits<{
  back: [];
  refreshed: [];
}>();

const toast = useToast();
const showInQydhaReq = useTournament().UpdateShowInQydha();

const showInQydha = ref(false);

watch(
  () => props.tournament?.showInQydha,
  (value) => {
    if (value !== undefined) showInQydha.value = !!value;
  },
  { immediate: true },
);

const showInQydhaPending = computed(
  () => showInQydhaReq.status.value === "pending",
);

const joinSettingsDrawer = useTemplateRef<InstanceType<typeof TournamentJoinRequestSettingsDrawer>>(
  "joinSettingsDrawer",
);

function openJoinSettingsDrawer() {
  if (joinSettingsDrawer.value) joinSettingsDrawer.value.open = true;
}

async function onShowInQydhaChange(value: boolean) {
  const previous = showInQydha.value;
  showInQydha.value = value;

  await showInQydhaReq.fetchREQ(props.id, value);

  if (showInQydhaReq.status.value === "success") {
    toast.add({
      title: value ? "تم تفعيل الظهور في قيدها" : "تم إخفاء البطولة من قيدها",
      color: "success",
    });
    emit("refreshed");
    return;
  }

  showInQydha.value = previous;
  toast.add({
    title: "تعذّر تحديث إعداد الظهور",
    color: "error",
  });
}
</script>
