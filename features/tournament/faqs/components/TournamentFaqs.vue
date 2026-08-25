<template>
  <UCard v-if="!embedded">
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
            الأسئلة الشائعة ({{ faqs.length }})
          </h1>
        </div>
        <UButton
          v-if="canMutate"
          label="إضافة سؤال"
          color="primary"
          icon="i-heroicons-plus-circle"
          @click="openAddModal"
        />
      </div>
    </template>
    <TournamentFaqsContent
      :faqs="faqs"
      :can-mutate="canMutate"
      :pending="getFaqsREQ.pending.value"
      :error="getFaqsREQ.error.value"
      @refresh="getFaqsREQ.refresh()"
      @add="openAddModal"
      @edit="openEditModal"
      @delete="confirmDelete"
      :deleting-id="deletingId"
      :delete-pending="deleteREQ.status.value === 'pending'"
    />
  </UCard>

  <div v-else>
    <div v-if="canMutate" class="mb-4 flex justify-end">
      <UButton
        label="إضافة سؤال"
        color="primary"
        icon="i-heroicons-plus-circle"
        @click="openAddModal"
      />
    </div>
    <TournamentFaqsContent
      :faqs="faqs"
      :can-mutate="canMutate"
      :pending="getFaqsREQ.pending.value"
      :error="getFaqsREQ.error.value"
      @refresh="getFaqsREQ.refresh()"
      @add="openAddModal"
      @edit="openEditModal"
      @delete="confirmDelete"
      :deleting-id="deletingId"
      :delete-pending="deleteREQ.status.value === 'pending'"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TournamentFaq } from "~/features/tournament/models/faq";
import ConfirmModal from "~/components/ConfirmationModal.vue";
import AddFaqModal from "./AddFaqModal.vue";
import EditFaqModal from "./EditFaqModal.vue";
import TournamentFaqsContent from "./TournamentFaqsContent.vue";
import { useMyAuthStore } from "~/store/Auth";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import { useTournamentFaqsApi } from "~/features/tournament/faqs/composables/useTournamentFaqsApi";
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

const getFaqsREQ = useTournamentFaqsApi().getFaqs(tour_id);
const deleteREQ = useTournamentFaqsApi().deleteFaq();

const faqs = computed(() => getFaqsREQ.data.value ?? []);
const deletingId = ref<string | null>(null);

const canMutate = computed(
  () =>
    (!!userStore.isAdmin || !!userStore.isOrganizer) &&
    tourREQ.data.value?.tournament?.detailedState !=
      TournamentDetailedState.Finished,
);

function openAddModal() {
  overlay
    .create(AddFaqModal, {
      props: { tourId: tour_id, defaultAppearOrder: faqs.value.length },
    })
    .open();
}

function openEditModal(faq: TournamentFaq) {
  overlay
    .create(EditFaqModal, { props: { tourId: tour_id, faq } })
    .open();
}

const confirmModal = overlay.create(ConfirmModal);

async function confirmDelete(faq: TournamentFaq) {
  const instance = confirmModal.open({
    message: `هل أنت متأكد من حذف السؤال "${faq.question}"؟`,
  });
  const confirmed = await instance.result;
  if (!confirmed) return;

  deletingId.value = faq.id;
  await deleteREQ.fetchREQ(tour_id, faq.id);
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
