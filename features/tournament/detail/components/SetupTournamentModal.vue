<template>
  <UModal
    title="بدء تنظيم البطولة"
    prevent-close
    description="هل أنت متأكد من بدء تنظيم البطولة؟"
  >
    <template #body>
      <div class="flex flex-col gap-2">
        <p>برجاء اختيار طريقة تنظيم البطوله</p>
        <URadioGroup v-model="hasStaging" :items="items" dir="rtl" />
        <UAlert
          v-if="hasStaging === 'qualifications' && !hasPlaces"
          color="warning"
          variant="soft"
          class="mt-2"
          title="لا توجد أماكن تصفيات على هذه البطولة"
          description="فعّل مرحلة التصفيات وأضف الأماكن عند إنشاء طلب البطولة."
        />
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-between">
        <UButton
          label="تأكيد"
          color="success"
          size="lg"
          variant="soft"
          :disabled="hasStaging === 'qualifications' && !hasPlaces"
          @click="confirm"
        />
        <UButton
          label="إلغاء"
          color="error"
          size="lg"
          variant="soft"
          @click="cancel"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { useTournamentPlaces } from "~/features/tournament/composables/useTournamentPlaces";

const props = defineProps<{
  tournamentId: string;
}>();

const hasStaging = ref<"direct" | "qualifications">("direct");

const tourREQ = await useSingleTournament().getSingelTournament(
  props.tournamentId,
);
const { hasPlaces } = useTournamentPlaces(() => tourREQ.data.value);

const items = computed(() => [
  {
    label: "نهائيات مباشرة",
    value: "direct" as const,
  },
  {
    label: "مرحلة التصفيات",
    value: "qualifications" as const,
    disabled: !hasPlaces.value,
  },
]);

const emit = defineEmits<{
  close: [false | "direct" | "qualifications"];
}>();

const cancel = () => {
  emit("close", false);
};

const confirm = () => {
  if (hasStaging.value === "qualifications" && !hasPlaces.value) return;
  emit("close", hasStaging.value);
};
</script>
