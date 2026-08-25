<template>
  <UModal
    title="إضافة سؤال شائع"
    prevent-close
    description="أضف سؤالاً وإجابته ليظهر في صفحة البطولة"
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
          v-if="createREQ.error.value"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="mutationErrorDescription(createREQ.error.value)"
        />
      </UForm>
    </template>
    <template #footer>
      <div class="flex items-center justify-between gap-2">
        <UButton
          label="إضافة"
          color="primary"
          icon="i-heroicons-plus-circle"
          :loading="createREQ.status.value === 'pending'"
          @click="formRef?.submit()"
        />
        <UButton
          label="إلغاء"
          color="error"
          variant="soft"
          :disabled="createREQ.status.value === 'pending'"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import FaqFormFields from "./FaqFormFields.vue";
import { createEmptyTournamentFaqInput } from "~/features/tournament/models/faq";
import { useTournamentFaqsApi } from "~/features/tournament/faqs/composables/useTournamentFaqsApi";
import { tournamentFaqSchema } from "~/features/tournament/faqs/utils/faqSchema";
import { mutationErrorDescription } from "~/features/tournament/shared/mutationError.utils";

const props = defineProps<{
  tourId: string;
  defaultAppearOrder?: number;
  initialQuestion?: string;
  initialAnswer?: string;
}>();

const emit = defineEmits(["close"]);
const toast = useToast();
const formRef = ref<{ submit: () => void }>();
const state = reactive(
  createEmptyTournamentFaqInput(props.defaultAppearOrder ?? 0, {
    question: props.initialQuestion,
    answer: props.initialAnswer,
  }),
);

const createREQ = useTournamentFaqsApi().createFaq();

const onSubmit = async () => {
  await createREQ.fetchREQ(props.tourId, { ...state });
  if (createREQ.status.value === "success") {
    toast.add({
      title: "تمت الإضافة بنجاح",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    emit("close");
  } else if (createREQ.status.value === "error") {
    toast.add({
      title: "خطأ في الإضافة",
      description: mutationErrorDescription(createREQ.error.value),
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
};
</script>
