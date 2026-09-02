<template>
  <UModal v-model:open="open">
    <template #header>
      <span class="font-semibold">الاختيار العشوائي</span>
    </template>
    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          حدّد عدد الطلبات التي تريد الموافقة عليها موافقةً أولية، واختر
          <strong>المكان الذي نسحب منه</strong> فقط — لا يُختار من كل
          الطلبات ولا من كل الأماكن.
        </p>
        <UFormField label="الموافقة على عدد عشوائي" required>
          <UInput
            v-model.number="randomCount"
            type="number"
            :min="1"
            placeholder="عدد الطلبات"
          />
        </UFormField>
        <UFormField label="السحب من مكان التصفيات" required>
          <USelect
            v-model="targetPlaceId"
            :items="placeOptions"
            value-key="value"
            label-key="label"
            placeholder="اختر المكان"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="open = false">
          إلغاء
        </UButton>
        <UButton
          color="primary"
          :loading="loading"
          :disabled="!canConfirm"
          @click="onConfirm"
        >
          تنفيذ الموافقة
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { GetTournamentPlace } from "~/features/tournament/models/place";
import {
  getJoinRequestTargetPlaces,
  placeOptionLabel,
} from "~/features/tournament/join-request/composables/joinRequestPlaces.utils";

const props = defineProps<{
  places: GetTournamentPlace[];
  loading?: boolean;
}>();

const emit = defineEmits<{ confirm: [count: number, placeId: string] }>();

const open = defineModel<boolean>("open", { default: false });

const targetPlaceId = ref<string | null>(null);
const randomCount = ref(1);

const placeOptions = computed(() =>
  getJoinRequestTargetPlaces(props.places).map((p) => ({
    label: placeOptionLabel(p),
    value: p.id,
  })),
);

const canConfirm = computed(
  () => !!targetPlaceId.value && randomCount.value > 0,
);

watch(open, (isOpen) => {
  if (isOpen) {
    randomCount.value = 1;
    if (!targetPlaceId.value && placeOptions.value[0]) {
      targetPlaceId.value = placeOptions.value[0].value;
    }
  }
});

function onConfirm() {
  if (!targetPlaceId.value || randomCount.value < 1) return;
  emit("confirm", randomCount.value, targetPlaceId.value);
}
</script>
