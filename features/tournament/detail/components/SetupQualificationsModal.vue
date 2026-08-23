<template>
  <UModal
    title="إعداد مجموعات التصفيات"
    prevent-close
    description="عرّف مجموعات التصفيات واختر مكان كل مجموعة"
    :ui="{ content: 'sm:max-w-2xl' }"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          v-if="!hasPlaces"
          color="warning"
          variant="soft"
          title="لا توجد أماكن تصفيات"
          description="يجب تعريف أماكن التصفيات في طلب إنشاء البطولة أولاً."
        />

        <div
          v-for="(group, index) in groups"
          :key="index"
          class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        >
          <div class="mb-3 flex items-center justify-between">
            <h4 class="text-sm font-semibold">مجموعة {{ index + 1 }}</h4>
            <UButton
              v-if="groups.length > 1"
              color="error"
              variant="ghost"
              size="sm"
              icon="i-heroicons-trash"
              @click="removeGroup(index)"
            />
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <UFormField label="اسم المجموعة" required>
              <UInput v-model="group.groupName" placeholder="مثال: مجموعة أ" />
            </UFormField>
            <UFormField label="مكان التصفيات" required>
              <USelect
                v-model="group.placeId"
                :items="placeOptions"
                placeholder="اختر المكان"
              />
            </UFormField>
            <UFormField label="وقت تسجيل الحضور" required>
              <AsyncDatePicker v-model="group.checkInAt" :min-date="new Date()" />
            </UFormField>
            <UFormField label="وقت البداية" required>
              <AsyncDatePicker
                v-model="group.startAt"
                :min-date="group.checkInAt || undefined"
              />
            </UFormField>
            <UFormField label="عدد الفرق المتأهلة" required>
              <UInput
                v-model.number="group.qualifyingTeams"
                type="number"
                min="1"
              />
            </UFormField>
          </div>
        </div>

        <UButton
          label="إضافة مجموعة"
          color="primary"
          variant="soft"
          icon="i-heroicons-plus-circle"
          :disabled="!hasPlaces"
          @click="addGroup"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-2">
        <UButton
          label="تأكيد"
          color="success"
          size="lg"
          variant="soft"
          :disabled="!canSubmit"
          @click="confirm"
        />
        <UButton
          label="إلغاء"
          color="error"
          size="lg"
          variant="soft"
          @click="emit('close', false)"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { SetupQualificationGroup } from "~/features/tournament/models/place";
import { useTournamentPlaces } from "~/features/tournament/composables/useTournamentPlaces";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";

const props = defineProps<{
  tournamentId: string;
}>();

const emit = defineEmits<{
  close: [SetupQualificationGroup[] | false];
}>();

const tourREQ = await useSingleTournament().getSingelTournament(
  props.tournamentId,
);
const { placeOptions, hasPlaces, places } = useTournamentPlaces(
  () => tourREQ.data.value,
);

const emptyGroup = (): SetupQualificationGroup => ({
  checkInAt: "",
  startAt: "",
  groupName: "",
  qualifyingTeams: 2,
  placeId: places.value[0]?.id ?? "",
});

const groups = ref<SetupQualificationGroup[]>([emptyGroup()]);

watch(
  places,
  (list) => {
    if (list[0] && !groups.value[0]?.placeId) {
      groups.value[0]!.placeId = list[0].id;
    }
  },
  { immediate: true },
);

const addGroup = () => {
  groups.value.push(emptyGroup());
};

const removeGroup = (index: number) => {
  if (groups.value.length <= 1) return;
  groups.value.splice(index, 1);
};

const canSubmit = computed(() => {
  if (!hasPlaces.value || groups.value.length === 0) return false;
  return groups.value.every(
    (g) =>
      g.groupName.trim() &&
      g.placeId &&
      g.checkInAt &&
      g.startAt &&
      g.qualifyingTeams >= 1,
  );
});

const confirm = () => {
  if (!canSubmit.value) return;
  emit("close", groups.value);
};
</script>
