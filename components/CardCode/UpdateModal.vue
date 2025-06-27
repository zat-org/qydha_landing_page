<template>
  <UModal title="تعديل بيانات المجموعة" description="تعديل بيانات المجموعة " prevent-close>
    <template #body>

      <UForm :state="state" :schema="schema" @submit="handleSubmit" class="space-y-4">
        <UFormField label="عدد الأيام" name="numberOfDays">
          <UInput v-model="state.numberOfDays" type="number" placeholder="أدخل عدد الأيام" />
        </UFormField>

        <UFormField label="تاريخ الانتهاء" name="expireAt">
          <UInput v-model="state.expireAt" type="datetime-local" placeholder="حدد تاريخ الانتهاء" />
        </UFormField>

      </UForm>

    </template>
    <template #footer>

      <div class="flex justify-end gap-2">
        <UButton type="submit" color="primary" :loading="updateREQ.status.value == 'pending'">حفظ</UButton>
        <UButton type="button" color="secondary" @click="emit('close')">إلغاء</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { CardGroupI } from "~/models/CardCode";
import * as yup from "yup";
const props = defineProps<{
  cardGroup: CardGroupI;
}>();
const toast = useToast();
const emit = defineEmits(["update", 'close']);

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
    toast.add({ title: "تم تحديث الكود بنجاح", color: "success" });
    emit('close')
  } else if (updateREQ.status.value == "error") {
    toast.add({ title: "فشل في تحديث الكود", color: "error" });
  }

};
</script>
