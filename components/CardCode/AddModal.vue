<template>
  <UModal title="إنشاء اكواد كروت جديدة" description="إنشاء اكواد كروت جديدة" prevent-close>
      <template #body>
        <UForm :state="state" :schema="schema" @submit="handleSubmit" class="space-y-4">
          <UFormField label="كود المجموعة" name="groupCode">
            <UInput v-model="state.groupCode" :placeholder="cardGroup.groupCode" disabled />
          </UFormField>
  
          <UFormField label="عدد الأيام" name="numberOfDays">
            <UInput v-model="state.numberOfDays" type="number" placeholder="أدخل عدد الأيام" />
          </UFormField>
  
          <UFormField label="تاريخ الانتهاء" name="expireAt">
            <UInput v-model="state.expireAt" type="datetime-local" placeholder="حدد تاريخ الانتهاء" />
          </UFormField>
  
          <UFormField label="عدد الأكواد" name="codesCount">
            <UInput v-model="state.codesCount" type="number" placeholder="أدخل عدد الأكواد" />
          </UFormField>
  
          
        </UForm>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton type="submit" color="primary">حفظ</UButton>
          <UButton type="button" color="secondary" @click="emit('close')">إلغاء</UButton>
        </div>
      </template>
  </UModal>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import type { CardGroupI } from '~/models/CardCode.ts'

const props = defineProps<{
  cardGroup: CardGroupI
}>()

const emit = defineEmits(['close'])
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
    toast.add({ title: "تم إنشاء اكواد الكروت بنجاح", color: "success" });
    emit('close')
  } else if (createREQ.status.value === "error") {
    toast.add({ title: "فشل في إنشاء اكواد الكروت", color: "error" });
  }
};
</script>
