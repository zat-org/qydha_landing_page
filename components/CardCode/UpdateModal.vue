<template>
  <UModal prevent-close>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">تعديل بيانات المجموعة</h3>
          <p class="text-sm text-gray-500">{{ cardGroup.groupCode }}</p>
        </div>
      </template>

      <UForm
        :state="state"
        :schema="schema"
        @submit="handleSubmit"
        class="space-y-4"
      >
        <UFormGroup label="عدد الأيام" name="numberOfDays">
          <UInput
            v-model="state.numberOfDays"
            type="number"
            placeholder="أدخل عدد الأيام"
          />
        </UFormGroup>

        <UFormGroup label="تاريخ الانتهاء" name="expireAt">
          <UInput
            v-model="state.expireAt"
            type="datetime-local"
            placeholder="حدد تاريخ الانتهاء"
          />
        </UFormGroup>

        <div class="flex justify-end gap-2">
          <UButton
            type="submit"
            color="green"
            :loading="updateREQ.status.value == 'pending'"
            >حفظ</UButton
          >
          <UButton type="button" color="gray" @click="modal.close()"
            >إلغاء</UButton
          >
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { CardGroupI } from "~/models/CardCode";
import * as yup from "yup";
const props = defineProps<{
  cardGroup: CardGroupI;
}>();
const modal = useModal();
const toast = useToast();
const emit = defineEmits(["update"]);

const schema = yup.object({
  numberOfDays: yup
    .number()
    .required("عدد الأيام مطلوب")
    .min(1, "يجب أن يكون عدد الأيام أكبر من 0"),
  expireAt: yup
    .string()
    .required("تاريخ الانتهاء مطلوب")
    .test(
      "future-date",
      "يجب أن يكون التاريخ أكبر من تاريخ اليوم",
      function (value) {
        if (!value) return false;
        const selectedDate = new Date(value);
        const today = new Date();
        return selectedDate > today;
      }
    ),
});

const state = reactive({
  numberOfDays: props.cardGroup.numberOfDays || 0,
  expireAt: new Date(props.cardGroup.expireAt).toISOString().slice(0, 16),
});
const updateREQ = await useCardCode().updateCardCode();
const handleSubmit = async () => {
  await updateREQ.fetchREQ(props.cardGroup.groupCode, state);
  if (updateREQ.status.value == "success") {
    toast.add({ title: "تم تحديث الكود بنجاح", color: "green" });
    modal.close();
  } else if (updateREQ.status.value == "error") {
    toast.add({ title: "فشل في تحديث الكود", color: "red" });
  }

  // await updateREQ.fetchREQ(props.cardGroup.groupCode, state);

  // modal.close();
};
</script>
