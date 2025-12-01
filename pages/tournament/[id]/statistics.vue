<template>
  <UCard class="w-full mx-auto" :ui="{ root: 'w-full h-screen flex flex-col' ,body:'flex-1 overflow-y-auto'}">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img
            :src="qydhaLogo"
            alt="قيدها"
            class="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
          <div class="space-y-1">
            <h1 class="text-2xl font-bold">إحصائيات البطولة</h1>       
          </div>
        </div>

        <UBadge v-if="matchesCount !== null" color="primary" size="lg" variant="soft">
          عدد المباريات: {{ matchesCount }}
        </UBadge>
      </div>
    </template>

    <!-- <Loading v-if="pending" class="mt-10" /> -->

    <div v-if="error" class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-mdi-alert-circle" class="w-16 h-16 text-red-500 mb-4" />
      <p class="text-lg text-gray-600 dark:text-gray-400">
        حدث خطأ أثناء تحميل الإحصائيات
      </p>
      <UButton @click="refresh" class="mt-4" color="primary" variant="soft">
        إعادة المحاولة
      </UButton>
    </div>

    <div v-else-if="statEntries.length" class="flex-1 flex flex-col ">
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-auto">
        <!-- Left Table -->
        <div
          class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-auto"
        >
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <!-- <th
                  scope="col"
                  class="px-3 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 w-12"
                >
                  #
                </th> -->
                <th
                  scope="col"
                  class="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  الإحصائيات
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left sm:text-right text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  العدد
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="item in leftTableEntries"
                :key="item.key"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
              >
                <!-- <td class="px-3 py-3 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {{ item.order }}
                </td> -->
                <td class="px-4 py-3 text-base text-gray-900 dark:text-gray-100">
                  {{ item.label }}
                </td>
                <td
                  class="px-4 py-3 text-lg font-bold text-primary-600 dark:text-primary-400 text-left sm:text-right"
                >
                  {{ formatStatValue(item.value) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Right Table -->
        <div
          class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-auto"
        >
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <!-- <th
                  scope="col"
                  class="px-3 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 w-12"
                >
                  #
                </th> -->
                <th
                  scope="col"
                  class="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  الإحصائيات
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left sm:text-right text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  العدد
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="item in rightTableEntries"
                :key="item.key"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
              >
                <!-- <td class="px-3 py-3 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {{ item.order }}
                </td> -->
                <td class="px-4 py-3 text-base text-gray-900 dark:text-gray-100">
                  {{ item.label }}
                </td>
                <td
                  class="px-4 py-3 text-lg font-bold text-primary-600 dark:text-primary-400 text-left sm:text-right"
                >
                  {{ item.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-mdi-chart-box-outline" class="w-16 h-16 text-gray-400 mb-4" />
      <p class="text-lg text-gray-600 dark:text-gray-400">
        لا توجد إحصائيات متاحة
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import Loading from "~/components/loading.vue";
import qydhaLogo from "~/assets/images/qydha-logo.svg";

const route = useRoute();
const id = route.params.id.toString();

const { getTournamentStatistics } = useTournament();
const statsReq = await getTournamentStatistics(id);

const pending = computed(() => statsReq.pending.value);
const error = computed(() => statsReq.error.value);

// API raw response: { data: { statistics: {...}, matchesCount }, message }
const apiData = computed(() => statsReq.data.value as any || null);
const statistics = computed<Record<string, number>>(
  () => apiData.value?.data?.statistics ?? {}
);
const matchesCount = computed<number | null>(
  () => (apiData.value?.data?.matchesCount ?? null) as number | null
);
const apiMessage = computed<string>(() => apiData.value?.message ?? "");

const refresh = () => {
  refreshNuxtData(`getTournamentStatistics-${id}`);
};

// Auto-refetch statistics every 60 seconds
onMounted(() => {
  const intervalId = setInterval(() => {
    refresh();
  }, 10*60_000);

  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
});

// Arabic labels for known keys
const labels: Record<string, string> = {
  playedSakkas: "عدد الصكات الملعوبة",
  winnedSakkas: "عدد الصكات الفائزة",
  lostSakka: "عدد الصكات الخاسرة",
  moshtaraSunCount: "عدد مشتريات الصن",
  moshtaraHokmCount: "عدد مشتريات الحكم",
  wonMoshtaraCount: "عدد المشتريات الرابحة",
  lostMoshtaraCount: "عدد المشتريات الخاسرة",
  ekak: "إكك",
  aklat: "أكلات",
  sra: "سرا",
  khamsen: "خمسين",
  me2a: "مئة",
  rob3ome2a: "ربعمئة",
  baloot: "بلوت",
  sunKaboot: " كبوت صن ",
  hokmKaboot: " كبوت حكم ",
  matchesCount: "عدد المباريات",
};

// Order mapping for each statistic (lower number = appears first)
const orderMap: Record<string, number> = {
  matchesCount: 1,
  playedSakkas: 2,
  winnedSakkas: 3,
  lostSakka: 4,
  moshtaraSunCount: 5,
  moshtaraHokmCount: 6,
  wonMoshtaraCount: 7,
  lostMoshtaraCount: 8,
  sra: 9,
  khamsen: 10,
  me2a: 11,
  rob3ome2a: 12,    
  baloot: 13,
  ekak: 14,
  aklat: 15,
  sunKaboot: 16,
  hokmKaboot: 17,
};

const statEntries = computed(() => {
  const entries: Array<{ key: string; label: string; value: number; order: number }> = [];

  // Add matchesCount first if available
  if (matchesCount.value !== null) {
    entries.push({
      key: "matchesCount",
      label: labels["matchesCount"] ?? "matchesCount",
      value: matchesCount.value,
      order: orderMap["matchesCount"] ?? 999,
    });
  }

  const stats = statistics.value || {};
  Object.entries(stats).forEach(([key, value]) => {
    if (typeof value === "number") {
      entries.push({
        key,
        label: labels[key] ?? key,
        value,
        order: orderMap[key] ?? 999,
      });
    }
  });

  // Sort by order
  return entries.sort((a, b) => a.order - b.order);
});

// Split entries into left and right tables
const leftTableEntries = computed<Array<{ key: string; label: string; value: number; order: number }>>(() => {
  const sorted = statEntries.value;
//   const mid = Math.ceil(sorted.length / 2);
  return sorted.slice(0, 8);
});

const rightTableEntries = computed<Array<{ key: string; label: string; value: number; order: number }>>(() => {
  const sorted = statEntries.value;
//   const mid = Math.ceil(sorted.length / 2);
  return sorted.slice(8);
});



definePageMeta({
  layout: "custom",
});

useHead({
  title: "إحصائيات البطولة",
  meta: [{ name: "description", content: "إحصائيات البطولة" }],
});
</script>

<style scoped>
</style>