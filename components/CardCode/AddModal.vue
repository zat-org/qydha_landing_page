<template>
  <UModal prevent-close>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">إنشاء اكواد كروت جديدة</h3>
        </div>
      </template>

      <UForm :state="state" :schema="schema" @submit="handleSubmit" class="space-y-4">
        <UFormGroup label="كود المجموعة" name="groupCode">
          <UInput v-model="state.groupCode" :placeholder="cardGroup.groupCode" disabled />
        </UFormGroup>

        <UFormGroup label="عدد الأيام" name="numberOfDays">
          <UInput v-model="state.numberOfDays" type="number" placeholder="أدخل عدد الأيام" />
        </UFormGroup>

        <UFormGroup label="تاريخ الانتهاء" name="expireAt">
          <UInput v-model="state.expireAt" type="datetime-local" placeholder="حدد تاريخ الانتهاء" />
        </UFormGroup>

        <UFormGroup label="عدد الأكواد" name="codesCount">
          <UInput v-model="state.codesCount" type="number" placeholder="أدخل عدد الأكواد" />
        </UFormGroup>

        <div class="flex justify-end gap-2">
          <UButton type="submit" color="green">حفظ</UButton>
          <UButton type="button" color="gray" @click="modal.close()">إلغاء</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import type { CardGroupI } from '~/models/CardCode.ts'

const props = defineProps<{
  cardGroup: CardGroupI
}>()

const modal = useModal();
const toast = useToast();

const schema = yup.object({
  groupCode: yup.string().required("كود المجموعة مطلوب"),
  numberOfDays: yup
    .number()
    .required("عدد الأيام مطلوب")
    .min(1, "يجب أن يكون عدد الأيام أكبر من 0"),
  expireAt: yup
    .string()
    .required("تاريخ الانتهاء مطلوب")
    .test("future-date", "يجب أن يكون التاريخ أكبر من تاريخ اليوم", (value) => {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      return selectedDate > today;
    }),
  codesCount: yup
    .number()
    .required("عدد الأكواد مطلوب")
    .min(1, "يجب أن يكون عدد الأكواد أكبر من 0"),
});

const state = reactive({
  groupCode: props.cardGroup.groupCode,
  numberOfDays: props.cardGroup.numberOfDays,
  expireAt: props.cardGroup.expireAt,
  codesCount: 0
});

const createREQ = await useCardCode().createCardCodeGroup();

const handleSubmit = async () => {
  await createREQ.fetchREQ(state);
  if (createREQ.status.value === "success") {
    toast.add({ title: "تم إنشاء اكواد الكروت بنجاح", color: "green" });
    modal.close();
  } else if (createREQ.status.value === "error") {
    toast.add({ title: "فشل في إنشاء اكواد الكروت", color: "red" });
  }
};
</script>
