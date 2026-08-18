<template>
  <UModal
    title="إضافة مكان تصفيات"
    prevent-close
    description="سيُنشأ مكان تصفيات وتُضاف طاولاته تلقائياً"
  >
    <template #body>
      <UForm
        :state="state"
        :schema="schema"
        ref="formRef"
        class="space-y-4"
        @submit="onSubmit"
      >
        <PlaceFormFields v-model="state" />
        <UAlert
          v-if="AddREQ.error.value"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="AddREQ.error.value?.message || 'حدث خطأ أثناء إضافة المكان'"
        />
      </UForm>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-between items-center">
        <UButton
          label="إضافة"
          color="primary"
          icon="i-heroicons-plus-circle"
          :loading="AddREQ.status.value === 'pending'"
          @click="formRef?.submit()"
        />
        <UButton
          label="إلغاء"
          color="error"
          variant="soft"
          :disabled="AddREQ.status.value === 'pending'"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string, number } from "yup";
import { createEmptyTournamentPlace } from "~/features/tournament/models/place";
import PlaceFormFields from "./PlaceFormFields.vue";

const props = defineProps<{
  tourId: string;
}>();

const emit = defineEmits(["close"]);
const toast = useToast();
const formRef = ref<{ submit: () => void }>();
const state = reactive(createEmptyTournamentPlace());

const schema = object({
  locationDescription: string()
    .required("وصف المكان مطلوب")
    .max(255, "وصف المكان يجب ألا يتجاوز 255 حرفاً"),
  location: object({ latitude: number(), longitude: number() }).test(
    "place-location-selected",
    "يرجى اختيار موقع المكان",
    (value) => !!value && value.latitude !== 0 && value.longitude !== 0,
  ),
  startAt: string().required("تاريخ بداية المكان مطلوب"),
  endAt: string()
    .required("تاريخ نهاية المكان مطلوب")
    .test(
      "end-after-start",
      "تاريخ النهاية يجب أن يكون بعد البداية أو مساوياً له",
      function (value) {
        const start = this.parent.startAt as string | undefined;
        if (!value || !start) return true;
        return new Date(value).getTime() >= new Date(start).getTime();
      },
    ),
  availableTablesCount: number()
    .typeError("عدد الطاولات مطلوب")
    .required("عدد الطاولات مطلوب")
    .min(1, "يجب أن يكون عدد الطاولات على الأقل 1"),
});

const AddREQ = useTournamentPlacesApi().addPlace();

const onSubmit = async () => {
  await AddREQ.fetchREQ(props.tourId, { ...state });
  if (AddREQ.status.value === "success") {
    toast.add({
      title: "تمت الإضافة بنجاح",
      description: `تم إضافة المكان "${state.locationDescription}"`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    emit("close");
  } else if (AddREQ.status.value === "error") {
    toast.add({
      title: "خطأ في الإضافة",
      description: AddREQ.error.value?.message || "حدث خطأ أثناء إضافة المكان",
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
};
</script>
