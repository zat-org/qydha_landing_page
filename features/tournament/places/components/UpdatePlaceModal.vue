<template>
  <UModal
    title="تعديل مكان التصفيات"
    prevent-close
    :description="props.place.locationDescription"
  >
    <template #body>
      <UForm
        :state="state"
        :schema="schema"
        ref="formRef"
        class="space-y-4"
        @submit="onSubmit"
      >
        <PlaceFormFields
          v-model="state"
          :min-tables-count="minTables"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400">
          لا يمكن أن يقل عدد الطاولات المتاحة عن الطاولات المتصلة حالياً ({{ minTables }}).
        </p>
        <UAlert
          v-if="UpdateREQ.error.value"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="UpdateREQ.error.value?.message || 'حدث خطأ أثناء تحديث المكان'"
        />
      </UForm>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-between items-center">
        <UButton
          label="حفظ التغييرات"
          color="primary"
          icon="i-heroicons-check-circle"
          :loading="UpdateREQ.status.value === 'pending'"
          @click="formRef?.submit()"
        />
        <UButton
          label="إلغاء"
          color="error"
          variant="soft"
          :disabled="UpdateREQ.status.value === 'pending'"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string, number } from "yup";
import type {
  CreateTournamentPlaceDto,
  GetTournamentPlace,
} from "~/features/tournament/models/place";
import PlaceFormFields from "./PlaceFormFields.vue";

const props = defineProps<{
  tourId: string;
  place: GetTournamentPlace;
}>();

const emit = defineEmits(["close"]);
const toast = useToast();
const formRef = ref<{ submit: () => void }>();

const minTables = computed(() =>
  Math.max(1, props.place.connectedTablesCount ?? 0),
);

const state = reactive<CreateTournamentPlaceDto>({
  startAt: props.place.startAt,
  endAt: props.place.endAt,
  location: { ...props.place.location },
  locationDescription: props.place.locationDescription,
  availableTablesCount: props.place.availableTablesCount,
});

const schema = computed(() =>
  object({
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
      .min(
        minTables.value,
        `عدد الطاولات لا يمكن أن يقل عن ${minTables.value}`,
      ),
  }),
);

const UpdateREQ = useTournamentPlacesApi().updatePlace();

const onSubmit = async () => {
  await UpdateREQ.fetchREQ(props.tourId, props.place.id, { ...state });
  if (UpdateREQ.status.value === "success") {
    toast.add({
      title: "تم التحديث بنجاح",
      description: `تم تحديث المكان "${state.locationDescription}"`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    emit("close");
  } else if (UpdateREQ.status.value === "error") {
    toast.add({
      title: "خطأ في التحديث",
      description:
        UpdateREQ.error.value?.message || "حدث خطأ أثناء تحديث المكان",
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
};
</script>
