<template>
  <UCard class="w-full mx-auto" :ui="{ root: 'w-full min-h-screen flex flex-col', body: 'flex-1 overflow-y-auto' }">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img
            :src="qydhaLogo"
            alt="قيدها"
            class="h-16 w-16 object-contain sm:h-20 sm:w-20"
          />
          <h1 class="text-2xl font-bold">إحصائيات البطولة</h1>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <UBadge v-if="totalGames !== null" color="primary" size="lg" variant="soft">
            عدد الألعاب: {{ totalGames }}
          </UBadge>
          <UBadge v-if="matchesCount !== null" color="primary" size="lg" variant="soft">
            عدد المباريات: {{ matchesCount }}
          </UBadge>
        </div>
      </div>
    </template>

    <div v-if="error" class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-mdi-alert-circle" class="mb-4 h-16 w-16 text-red-500" />
      <p class="text-lg text-gray-600 dark:text-gray-400">
        حدث خطأ أثناء تحميل الإحصائيات
      </p>
      <UButton class="mt-4" color="primary" variant="soft" @click="refresh">
        إعادة المحاولة
      </UButton>
    </div>

    <div v-else-if="hasStatistics" class="mx-auto w-full max-w-4xl space-y-4 p-2 sm:p-4">
      <div
        v-for="section in statSections"
        :key="section.id"
        dir="rtl"
        class="stats-panel w-full max-w-full"
      >
        <h2
          v-if="section.title"
          class="mb-2 px-1 text-sm font-bold text-slate-700 dark:text-slate-200 sm:text-base"
        >
          {{ section.title }}
        </h2>

        <div class="stats-panel__frame">
          <div class="flex flex-col gap-1">
            <div
              v-for="row in section.rows"
              :key="row.key"
              class="stats-panel__row"
            >
              <div class="stats-panel__value stats-panel__value--muted" aria-hidden="true">
                —
              </div>
              <div class="stats-panel__label">
                {{ row.label }}
              </div>
              <div class="stats-panel__value">
                {{ row.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-mdi-chart-box-outline" class="mb-4 h-16 w-16 text-gray-400" />
      <p class="text-lg text-gray-600 dark:text-gray-400">
        لا توجد إحصائيات متاحة
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import qydhaLogo from "~/assets/images/qydha-logo.svg";
import type { TournamentStatistics } from "~/features/tournament/models/tournament";

type StatKey = keyof TournamentStatistics["statistics"];

const route = useRoute();
const id = route.params.id?.toString() || "";

const statsReq = await useTournamentStatistics(id);

const error = computed(() => statsReq.error.value);

const apiData = computed(() => statsReq.data.value ?? null);
const statistics = computed<Partial<TournamentStatistics["statistics"]>>(
  () => apiData.value?.data?.statistics ?? apiData.value?.data ?? {},
);
const totalGames = computed<number | null>(
  () => (apiData.value?.data?.totalGames ?? null) as number | null,
);
const matchesCount = computed<number | null>(
  () => (apiData.value?.data?.matchesCount ?? null) as number | null,
);

const refresh = () => {
  refreshNuxtData(`getTournamentStatistics-${id}`);
};

onMounted(() => {
  const intervalId = setInterval(() => {
    refresh();
  }, 10 * 60_000);

  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
});

const labels: Record<StatKey, string> = {
  playedSakkas: "عدد الصكات",
  winnedSakkas: "عدد الصكات الفائزة",
  lostSakka: "عدد الصكات الخاسرة",
  moshtaraSunCount: "مشترى الصن",
  moshtaraHokmCount: "مشترى الحكم",
  wonMoshtaraCount: "مشترى ناجح",
  lostMoshtaraCount: "مشترى خسران",
  ekak: "إكك",
  aklat: "أكلات",
  sra: "سرا",
  khamsen: "خمسين",
  me2a: "مئة",
  rob3ome2a: "ربعمئة",
  baloot: "بلوت",
  sunKaboot: "كبوت صن",
  hokmKaboot: "كبوت حكم",
};

const statSectionConfig: Array<{
  id: string;
  title: string;
  keys: StatKey[];
}> = [
  { id: "matches", title: "المباريات", keys: ["playedSakkas", "winnedSakkas", "lostSakka"] },
  {
    id: "moshtara",
    title: "المشتريات",
    keys: ["moshtaraSunCount", "moshtaraHokmCount", "wonMoshtaraCount", "lostMoshtaraCount"],
  },
  { id: "kaboot", title: "الكبابيت", keys: ["sunKaboot", "hokmKaboot"] },
  { id: "masharee", title: "مشاريع", keys: ["sra", "baloot", "khamsen", "me2a", "rob3ome2a"] },
  { id: "ekakAklat", title: "الاكك و الاكلات", keys: ["ekak", "aklat"] },
];

const hasStat = (key: StatKey): boolean => {
  const stats = statistics.value as Record<string, number>;
  return stats[key] !== undefined && stats[key] !== null;
};

const statSections = computed(() =>
  statSectionConfig
    .map((section) => ({
      ...section,
      rows: section.keys
        .filter((key) => hasStat(key))
        .map((key) => ({
          key,
          label: labels[key],
          value: statistics.value[key] ?? 0,
        })),
    }))
    .filter((section) => section.rows.length > 0),
);

const hasStatistics = computed(() => statSections.value.length > 0);

definePageMeta({
  layout: "custom",
  public: true,
});

useHead({
  title: "إحصائيات البطولة",
  meta: [{ name: "description", content: "إحصائيات البطولة" }],
});
</script>

<style scoped>
.stats-panel__frame {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  padding: 0.75rem 0.5rem;
  border: 2px solid rgb(30 41 59);
  border-radius: 0.75rem;
  background: linear-gradient(
    to bottom,
    rgb(248 250 252),
    rgb(241 245 249),
    rgb(226 232 240 / 0.8)
  );
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
  transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
}

:global(.dark) .stats-panel__frame {
  border-color: rgb(51 65 85);
  background: linear-gradient(to bottom, rgb(24 24 27), rgb(9 9 11), rgb(0 0 0));
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
}

@media (min-width: 640px) {
  .stats-panel__frame {
    padding: 1rem;
    border-width: 2.5px;
    border-radius: 1rem;
  }
}

@media (min-width: 1024px) {
  .stats-panel__frame {
    padding: 1.25rem;
    border-width: 3px;
  }
}

.stats-panel__row {
  display: grid;
  gap: 0.25rem;
  grid-template-columns:
    minmax(2rem, 1fr)
    minmax(0, 1.45fr)
    minmax(2rem, 1fr);
}

@media (min-width: 480px) {
  .stats-panel__row {
    gap: 0.375rem;
    grid-template-columns:
      minmax(2.5rem, 1fr)
      minmax(0, 1.55fr)
      minmax(2.5rem, 1fr);
  }
}

@media (min-width: 640px) {
  .stats-panel__row {
    gap: 0.5rem;
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, 1.65fr)
      minmax(0, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-panel__row {
    grid-template-columns:
      minmax(0, 1.1fr)
      minmax(0, 1.85fr)
      minmax(0, 1.1fr);
  }
}

.stats-panel__value,
.stats-panel__label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  text-align: center;
  border-radius: 0.375rem;
  transition: background-color 0.3s, color 0.3s;
}

@media (min-width: 640px) {
  .stats-panel__value,
  .stats-panel__label {
    min-height: 2.25rem;
    border-radius: 0.5rem;
  }
}

.stats-panel__value {
  padding: 0 0.25rem;
  background: white;
  color: rgb(15 23 42);
  border: 1px solid rgb(226 232 240 / 0.9);
  font-size: 0.875rem;
  font-weight: 800;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

@media (min-width: 640px) {
  .stats-panel__value {
    padding: 0 0.5rem;
    font-size: 1rem;
  }
}

@media (min-width: 768px) {
  .stats-panel__value {
    font-size: 1.125rem;
  }
}

@media (min-width: 1024px) {
  .stats-panel__value {
    font-size: 1.25rem;
  }
}

:global(.dark) .stats-panel__value {
  background: rgb(248 250 252);
  color: rgb(15 23 42);
  border-color: rgb(255 255 255 / 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.stats-panel__value--muted {
  opacity: 0.35;
  font-weight: 700;
}

.stats-panel__label {
  padding: 0 0.375rem;
  background: linear-gradient(to bottom, rgb(30 41 59), rgb(15 23 42));
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1.25;
  overflow-wrap: anywhere;
  hyphens: auto;
}

@media (min-width: 640px) {
  .stats-panel__label {
    font-size: 0.75rem;
  }
}

@media (min-width: 768px) {
  .stats-panel__label {
    font-size: 0.875rem;
  }
}
</style>
