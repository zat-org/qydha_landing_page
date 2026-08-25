<template>
  <UCard v-if="!embedded && tour">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-arrow-right"
            label="عوده"
            variant="ghost"
            color="neutral"
            @click="goBack"
          />
          <h1 class="text-2xl font-bold">
            أسئلة المستخدمين ({{ totalCount }})
          </h1>
        </div>
      </div>
    </template>
    <TournamentUserQuestionsContent
      v-model:page-number="params.pageNumber"
      :items="items"
      :total-count="totalCount"
      :page-size="params.pageSize"
      :pending="getQuestionsREQ.pending.value"
      :error="getQuestionsREQ.error.value"
      :can-mutate="canMutate"
      :answering-id="answeringId"
      :deleting-id="deletingId"
      :answer-pending="answerREQ.status.value === 'pending'"
      :delete-pending="deleteREQ.status.value === 'pending'"
      @refresh="getQuestionsREQ.refresh()"
      @search="debouncedSearch"
      @answer="onAnswer"
      @create-faq="openCreateFaqFromQuestion"
      @delete="confirmDelete"
    />
  </UCard>

  <TournamentUserQuestionsContent
    v-else-if="embedded && tour"
    v-model:page-number="params.pageNumber"
    :items="items"
    :total-count="totalCount"
    :page-size="params.pageSize"
    :pending="getQuestionsREQ.pending.value"
    :error="getQuestionsREQ.error.value"
    :can-mutate="canMutate"
    :answering-id="answeringId"
    :deleting-id="deletingId"
    :answer-pending="answerREQ.status.value === 'pending'"
    :delete-pending="deleteREQ.status.value === 'pending'"
    @refresh="getQuestionsREQ.refresh()"
    @search="debouncedSearch"
    @answer="onAnswer"
    @create-faq="openCreateFaqFromQuestion"
    @delete="confirmDelete"
  />
</template>

<script lang="ts" setup>
import { useDebounceFn } from "@vueuse/core";
import type { TournamentUserQuestion } from "~/features/tournament/models/userQuestion";
import ConfirmModal from "~/components/ConfirmationModal.vue";
import AddFaqModal from "~/features/tournament/faqs/components/AddFaqModal.vue";
import TournamentUserQuestionsContent from "./TournamentUserQuestionsContent.vue";
import { useTournamentFaqsApi } from "~/features/tournament/faqs/composables/useTournamentFaqsApi";
import { useMyAuthStore } from "~/store/Auth";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import { useTournamentUserQuestionsApi } from "~/features/tournament/questions/composables/useTournamentUserQuestionsApi";
import { mutationErrorDescription } from "~/features/tournament/shared/mutationError.utils";

withDefaults(
  defineProps<{
    embedded?: boolean;
  }>(),
  { embedded: false },
);

const overlay = useOverlay();
const route = useRoute();
const toast = useToast();
const userStore = useMyAuthStore();
const tour_id = String(route.params.id ?? "");

function goBack() {
  void navigateTo(`/tournament/${tour_id}`);
}

const tourREQ = await useSingleTournament().getSingelTournament(tour_id);
if (tourREQ.status.value === "error") {
  navigateTo("/tournament");
}

const tour = computed(() => tourREQ.data.value?.tournament);

const canMutate = computed(
  () =>
    (!!userStore.isAdmin || !!userStore.isOrganizer) &&
    tour.value?.detailedState != TournamentDetailedState.Finished,
);

const params = ref({
  pageNumber: 1,
  pageSize: 10,
  searchToken: null as string | null,
});

const debouncedSearch = useDebounceFn((value: Event) => {
  const input = value.target as HTMLInputElement;
  params.value.searchToken = input.value ? input.value : null;
  params.value.pageNumber = 1;
}, 500);

const { getQuestions, answerQuestion, deleteQuestion } =
  useTournamentUserQuestionsApi();

const getQuestionsREQ = getQuestions(tour_id, params);
const getFaqsREQ = useTournamentFaqsApi().getFaqs(tour_id);
const answerREQ = answerQuestion();
const deleteREQ = deleteQuestion();

const items = computed(() => getQuestionsREQ.data.value?.items ?? []);
const totalCount = computed(() => getQuestionsREQ.data.value?.totalCount ?? 0);
const faqsCount = computed(() => getFaqsREQ.data.value?.length ?? 0);

const answeringId = ref<string | null>(null);
const deletingId = ref<string | null>(null);

async function onAnswer(questionId: string) {
  answeringId.value = questionId;
  await answerREQ.fetchREQ(tour_id, questionId, { ...params.value });
  answeringId.value = null;

  if (answerREQ.status.value === "success") {
    toast.add({
      title: "تم تسجيل الرد",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } else if (answerREQ.status.value === "error") {
    toast.add({
      title: "خطأ",
      description: mutationErrorDescription(answerREQ.error.value),
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
}

function openCreateFaqFromQuestion(question: TournamentUserQuestion) {
  overlay
    .create(AddFaqModal, {
      props: {
        tourId: tour_id,
        defaultAppearOrder: faqsCount.value,
        initialQuestion: question.question,
      },
    })
    .open();
}

const confirmModal = overlay.create(ConfirmModal);

async function confirmDelete(question: TournamentUserQuestion) {
  const instance = confirmModal.open({
    message: "هل أنت متأكد من حذف هذا السؤال؟",
  });
  const confirmed = await instance.result;
  if (!confirmed) return;

  deletingId.value = question.id;
  await deleteREQ.fetchREQ(tour_id, question.id, { ...params.value });
  deletingId.value = null;

  if (deleteREQ.status.value === "success") {
    toast.add({
      title: "تم الحذف بنجاح",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } else if (deleteREQ.status.value === "error") {
    toast.add({
      title: "خطأ في الحذف",
      description: mutationErrorDescription(deleteREQ.error.value),
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
}
</script>
