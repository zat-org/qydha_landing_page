<template>
  <UCard v-if="tour" dir="rtl" class="w-full min-w-0">
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
          <h1 class="text-2xl font-bold">الأسئلة</h1>
        </div>
      </div>
    </template>

    <UTabs
      v-model="activeTab"
      :items="tabItems"
      class="w-full min-w-0"
      dir="rtl"
      :unmount-on-hide="false"
    >
      <template #faqs>
        <TournamentFaqs embedded />
      </template>
      <template #user-questions>
        <TournamentUserQuestions embedded />
      </template>
    </UTabs>
  </UCard>
</template>

<script lang="ts" setup>
import TournamentFaqs from "~/features/tournament/faqs/components/TournamentFaqs.vue";
import TournamentUserQuestions from "~/features/tournament/questions/components/TournamentUserQuestions.vue";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";

const route = useRoute();
const router = useRouter();
const tour_id = String(route.params.id ?? "");

function goBack() {
  void navigateTo(`/tournament/${tour_id}`);
}

const tourREQ = await useSingleTournament().getSingelTournament(tour_id);
if (tourREQ.status.value === "error") {
  navigateTo("/tournament");
}

const tour = computed(() => tourREQ.data.value?.tournament);

const tabItems = [
  {
    label: "الأسئلة الشائعة",
    slot: "faqs",
    value: "faqs",
    icon: "i-heroicons-question-mark-circle",
  },
  {
    label: "أسئلة المستخدمين",
    slot: "user-questions",
    value: "user-questions",
    icon: "i-heroicons-chat-bubble-left-right",
  },
] as const;

type QaTab = (typeof tabItems)[number]["value"];

const activeTab = ref<QaTab>("faqs");

watch(
  () => route.query.tab,
  (tab) => {
    if (tab === "questions" || tab === "user-questions") {
      activeTab.value = "user-questions";
    } else if (tab === "faqs") {
      activeTab.value = "faqs";
    }
  },
  { immediate: true },
);

watch(activeTab, (tab) => {
  const queryTab = tab === "user-questions" ? "questions" : "faqs";
  if (route.query.tab === queryTab) return;
  void router.replace({
    path: route.path,
    query: { ...route.query, tab: queryTab },
  });
});
</script>
