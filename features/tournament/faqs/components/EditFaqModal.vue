<template>
  <UModal
    title="تعديل سؤال شائع"
    prevent-close
    description="عدّل السؤال أو الإجابة أو ترتيب الظهور"
  >
    <template #body>
      <UForm
        ref="formRef"
        :state="state"
        :schema="tournamentFaqSchema"
        class="space-y-4"
        @submit="onSubmit"
      >
        <FaqFormFields v-model="state" />
        <UAlert
          v-if="updateREQ.error.value"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="mutationErrorDescription(updateREQ.error.value)"
        />
      </UForm>
    </template>
    <template #footer>
      <div class="flex items-center justify-between gap-2">
        <UButton
          label="حفظ"
          color="primary"
          icon="i-heroicons-check"
          :loading="updateREQ.status.value === 'pending'"
          @click="formRef?.submit()"
        />
        <UButton
          label="إلغاء"
          color="error"
          variant="soft"
          :disabled="updateREQ.status.value === 'pending'"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import FaqFormFields from "./FaqFormFields.vue";
import type { TournamentFaq } from "~/features/tournament/models/faq";
import { useTournamentFaqsApi } from "~/features/tournament/faqs/composables/useTournamentFaqsApi";
import { tournamentFaqSchema } from "~/features/tournament/faqs/utils/faqSchema";
import { mutationErrorDescription } from "~/features/tournament/shared/mutationError.utils";

const props = defineProps<{
  tourId: string;
  faq: TournamentFaq;
}>();

const emit = defineEmits(["close"]);
const toast = useToast();
const formRef = ref<{ submit: () => void }>();
const state = reactive({
  question: props.faq.question,
  answer: props.faq.answer,
  appearOrder: props.faq.appearOrder,
});

const updateREQ = useTournamentFaqsApi().updateFaq();

const onSubmit = async () => {
  await updateREQ.fetchREQ(props.tourId, props.faq.id, { ...state });
  if (updateREQ.status.value === "success") {
    toast.add({
      title: "تم التحديث بنجاح",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    emit("close");
  } else if (updateREQ.status.value === "error") {
    toast.add({
      title: "خطأ في التحديث",
      description: mutationErrorDescription(updateREQ.error.value),
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
};
</script>
