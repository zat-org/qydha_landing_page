<template>
  <UModal
    :title="modalTitle"
    description="لاعبو الفريق"
    :ui="{ content: 'max-w-lg', body: 'overflow-y-auto max-h-[70vh]' }"
  >
    <template #body>
      <div v-if="pending" class="flex flex-col items-center justify-center gap-2 py-10">
        <UIcon
          name="i-heroicons-arrow-path"
          class="size-8 animate-spin text-primary"
        />
        <p class="text-sm text-gray-500">جاري تحميل بيانات الفريق…</p>
      </div>

      <UAlert
        v-else-if="errorMessage"
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        title="تعذّر تحميل الفريق"
        :description="errorMessage"
        class="my-2"
      />

      <div
        v-else-if="!players.length"
        class="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700"
      >
        لا يوجد لاعبون في هذا الفريق
      </div>

      <div v-else class="flex flex-col gap-3 py-1">
        <PlayerContactCard
          v-for="player in players"
          :key="player.id"
          :player="player"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end">
        <UButton
          label="إغلاق"
          color="neutral"
          variant="soft"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { ITeam } from "~/features/tournament/models/tournamentTeam";
import { useTourrnamentTeam } from "~/features/tournament/teams/composables/tourrnamentTeam";
import PlayerContactCard from "~/features/tournament/teams/components/PlayerContactCard.vue";

const props = defineProps<{
  tournamentId: string;
  teamId: string;
  teamName?: string | null;
}>();

const emit = defineEmits<{ close: [] }>();

const getTourTeam = useTourrnamentTeam().getTourTeam();

const pending = ref(true);
const errorMessage = ref<string | null>(null);
const team = ref<ITeam | null>(null);

const players = computed(() => team.value?.players ?? []);

const modalTitle = computed(
  () => team.value?.name || props.teamName?.split("|")[0]?.trim() || "لاعبو الفريق",
);

async function loadTeam() {
  pending.value = true;
  errorMessage.value = null;
  try {
    const result = await getTourTeam.fetchREQ(
      props.tournamentId,
      props.teamId,
    );
    if (!result) {
      errorMessage.value = "لم يتم العثور على الفريق";
      team.value = null;
      return;
    }
    team.value = result;
  } catch (e: unknown) {
    const err = e as { data?: { detail?: string }; message?: string };
    errorMessage.value =
      err?.data?.detail || err?.message || "حدث خطأ أثناء تحميل بيانات الفريق";
    team.value = null;
  } finally {
    pending.value = false;
  }
}

await loadTeam();
</script>
