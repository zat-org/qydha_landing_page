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

    <div v-if="error" class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-mdi-alert-circle" class="w-16 h-16 text-red-500 mb-4" />
      <p class="text-lg text-gray-600 dark:text-gray-400">
        حدث خطأ أثناء تحميل الإحصائيات
      </p>
      <UButton @click="refresh" class="mt-4" color="primary" variant="soft">
        إعادة المحاولة
      </UButton>
    </div>

    <div v-else-if="hasStatistics" class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left Column -->
        <div class="space-y-4">
          <UAccordion 
            :items="leftColumnItems" 
            v-model="leftOpenAccordions"
            type="multiple"
            class="w-full"
            :ui="{ 
              root: 'space-y-4',
              item: 'border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm last:border-b-1',
              trigger: 'w-full flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900/60 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors text-sm font-medium',
              content: 'px-0 pb-4 pt-0'
            }"
          >
        <!-- المباريات Accordion -->
        <template #matches>
          <div
            class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
          >
            <div 
              v-if="hasStat('playedSakkas')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.playedSakkas }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.playedSakkas }}
              </span>
            </div>
          </div>
        </template>

        <!-- المشتريات Accordion -->
        <template #moshtara>
          <div
            class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
          >
            <div 
              v-if="hasStat('moshtaraSunCount')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.moshtaraSunCount }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.moshtaraSunCount }}
              </span>
            </div>
            <div 
              v-if="hasStat('moshtaraHokmCount')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.moshtaraHokmCount }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.moshtaraHokmCount }}
              </span>
            </div>
            <div 
              v-if="hasStat('wonMoshtaraCount')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.wonMoshtaraCount }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.wonMoshtaraCount }}
              </span>
            </div>
            <div 
              v-if="hasStat('lostMoshtaraCount')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.lostMoshtaraCount }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.lostMoshtaraCount }}
              </span>
            </div>
          </div>
        </template>

        <!-- الكبابيت Accordion -->
        <template #kaboot>
          <div
            class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
          >
            <div 
              v-if="hasStat('sunKaboot')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.sunKaboot }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.sunKaboot }}
              </span>
            </div>
            <div 
              v-if="hasStat('hokmKaboot')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.hokmKaboot }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.hokmKaboot }}
              </span>
            </div>
          </div>
        </template>

        <!-- مشاريع Accordion -->
        <template #masharee>
          <div
            class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
          >
            <div 
              v-if="hasStat('sra')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.sra }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.sra }}
              </span>
            </div>
            <div 
              v-if="hasStat('baloot')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.baloot }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.baloot }}
              </span>
            </div>
            <div 
              v-if="hasStat('khamsen')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.khamsen }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.khamsen }}
              </span>
            </div>
            <div 
              v-if="hasStat('me2a')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.me2a }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.me2a }}
              </span>
            </div>
            <div 
              v-if="hasStat('rob3ome2a')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.rob3ome2a }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.rob3ome2a }}
              </span>
            </div>
          </div>
        </template>

        <!-- الاكك و الاكلات Accordion -->
        <template #ekakAklat>
          <div
            class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
          >
            <div 
              v-if="hasStat('ekak')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.ekak }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.ekak }}
              </span>
            </div>
            <div 
              v-if="hasStat('aklat')"
              class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span class="text-sm text-gray-700 dark:text-gray-200">
                {{ labels.aklat }}
              </span>
              <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {{ statistics.aklat }}
              </span>
            </div>
          </div>
        </template>
          </UAccordion>
        </div>

        <!-- Right Column -->
        <div class="space-y-4">
          <UAccordion 
            :items="rightColumnItems" 
            v-model="rightOpenAccordions"
            type="multiple"
            class="w-full"
            :ui="{ 
              root: 'space-y-4',
              item: 'border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm last:border-b-1',
              trigger: 'w-full flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900/60 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors text-sm font-medium',
              content: 'px-0 pb-4 pt-0'
            }"
          >
            <!-- المباريات Accordion -->
            <template #matches>
              <div
                class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
              >
                <div 
                  v-if="hasStat('playedSakkas')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.playedSakkas }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.playedSakkas }}
                  </span>
                </div>
              </div>
            </template>

            <!-- المشتريات Accordion -->
            <template #moshtara>
              <div
                class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
              >
                <div 
                  v-if="hasStat('moshtaraSunCount')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.moshtaraSunCount }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.moshtaraSunCount }}
                  </span>
                </div>
                <div 
                  v-if="hasStat('moshtaraHokmCount')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.moshtaraHokmCount }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.moshtaraHokmCount }}
                  </span>
                </div>
                <div 
                  v-if="hasStat('wonMoshtaraCount')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.wonMoshtaraCount }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.wonMoshtaraCount }}
                  </span>
                </div>
                <div 
                  v-if="hasStat('lostMoshtaraCount')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.lostMoshtaraCount }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.lostMoshtaraCount }}
                  </span>
                </div>
              </div>
            </template>

            <!-- الكبابيت Accordion -->
            <template #kaboot>
              <div
                class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
              >
                <div 
                  v-if="hasStat('sunKaboot')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.sunKaboot }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.sunKaboot }}
                  </span>
                </div>
                <div 
                  v-if="hasStat('hokmKaboot')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.hokmKaboot }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.hokmKaboot }}
                  </span>
                </div>
              </div>
            </template>

            <!-- مشاريع Accordion -->
            <template #masharee>
              <div
                class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
              >
                <div 
                  v-if="hasStat('sra')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.sra }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.sra }}
                  </span>
                </div>
                <div 
                  v-if="hasStat('baloot')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.baloot }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.baloot }}
                  </span>
                </div>
                <div 
                  v-if="hasStat('khamsen')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.khamsen }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.khamsen }}
                  </span>
                </div>
                <div 
                  v-if="hasStat('me2a')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.me2a }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.me2a }}
                  </span>
                </div>
                <div 
                  v-if="hasStat('rob3ome2a')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.rob3ome2a }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.rob3ome2a }}
                  </span>
                </div>
              </div>
            </template>

            <!-- الاكك و الاكلات Accordion -->
            <template #ekakAklat>
              <div
                class="mx-4 mt-3 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
              >
                <div 
                  v-if="hasStat('ekak')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.ekak }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.ekak }}
                  </span>
                </div>
                <div 
                  v-if="hasStat('aklat')"
                  class="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ labels.aklat }}
                  </span>
                  <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {{ statistics.aklat }}
                  </span>
                </div>
              </div>
            </template>
          </UAccordion>
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
import qydhaLogo from "~/assets/images/qydha-logo.svg";
import type { TournamentStatistics } from "~/models/tournament";

const route = useRoute();
const id = route.params.id.toString();

const { getTournamentStatistics } = useTournament();
const statsReq = await getTournamentStatistics(id);

const pending = computed(() => statsReq.pending.value);
const error = computed(() => statsReq.error.value);

// API raw response: { data: { statistics: {...}, matchesCount }, message }
const apiData = computed(() => statsReq.data.value as any || null);
const statistics = computed<TournamentStatistics['statistics']>(
  () => apiData.value?.data?.statistics ?? {}
);
const matchesCount = computed<number | null>(
  () => (apiData.value?.data?.matchesCount ?? null) as number | null
);

const refresh = () => {
  refreshNuxtData(`getTournamentStatistics-${id}`);
};

// Auto-refetch statistics every 10 minutes
onMounted(() => {
  const intervalId = setInterval(() => {
    refresh();
  }, 10 * 60_000);

  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
});

// Arabic labels for known keys
const labels: Record<string, string> = {
  playedSakkas: "عدد الصكات ",
  winnedSakkas: "عدد الصكات الفائزة",
  lostSakka: "عدد الصكات الخاسرة",
  moshtaraSunCount: " مشترى الصن",
  moshtaraHokmCount: " مشترى الحكم",
  wonMoshtaraCount: " مشترى ناجح",
  lostMoshtaraCount: " مشترى خسران",
  ekak: "إكك",
  aklat: "أكلات",
  sra: "سرا",
  khamsen: "خمسين",
  me2a: "مئة",
  rob3ome2a: "ربعمئة",
  baloot: "بلوت",
  sunKaboot: "كبوت صن",
  hokmKaboot: "كبوت حكم",
  matchesCount: "عدد المباريات",
};

// Check if a statistic exists and has a value
const hasStat = (key: keyof TournamentStatistics['statistics']): boolean => {
  const stats = statistics.value as Record<string, number>;
  return stats[key] !== undefined && stats[key] !== null;
};

// Check if there are any statistics to display
const hasStatistics = computed(() => {
  const stats = statistics.value || {};
  return Object.keys(stats).length > 0;
});

// Track open accordions separately for left and right columns
const leftOpenAccordions = ref<string[]>([]);
const rightOpenAccordions = ref<string[]>([]);

// Accordion items configuration
const accordionItems = computed(() => {
  const items: Array<{ label: string; slot: string; defaultOpen: boolean; class?: string }> = [];

  // المباريات - Matches
  if (hasStat('playedSakkas')) {
    items.push({
      label: "المباريات",
      slot: "matches",
      defaultOpen: true,
    });
  }

  // المشتريات - Purchases
  if (hasStat('moshtaraSunCount') || hasStat('moshtaraHokmCount') || 
      hasStat('wonMoshtaraCount') || hasStat('lostMoshtaraCount')) {
    items.push({
      label: "المشتريات",
      slot: "moshtara",
      defaultOpen: true,
    });
  }

  // الكبابيت - Kaboot
  if (hasStat('sunKaboot') || hasStat('hokmKaboot')) {
    items.push({
      label: "الكبابيت",
      slot: "kaboot",
      defaultOpen: true,
      class:'border !important border-gray-200 dark:border-gray-800 mb-1  '
    });
  }

  // مشاريع - Projects
  if (hasStat('sra') || hasStat('baloot') || hasStat('khamsen') || 
      hasStat('me2a') || hasStat('rob3ome2a')) {
    items.push({
      label: "مشاريع",
      slot: "masharee",
      defaultOpen: true,
    });
  }

  // الاكك و الاكلات - Ekak and Aklat
  if (hasStat('ekak') || hasStat('aklat')) {
    items.push({
      label: "الاكك و الاكلات",
      slot: "ekakAklat",
      defaultOpen: true,
    });
  }

  return items;
});

// Split accordions into left and right columns
const leftColumnItems = computed(() => {
  const items = accordionItems.value;
  const mid = Math.ceil(items.length / 2);
  return items.slice(0, mid);
});

const rightColumnItems = computed(() => {
  const items = accordionItems.value;
  const mid = Math.ceil(items.length / 2);
  return items.slice(mid);
});

// Initialize all accordions as open by default
watch([leftColumnItems, rightColumnItems], ([leftItems, rightItems]) => {
  // Initialize left column accordions - all open by default
  if (leftOpenAccordions.value.length === 0 && leftItems.length > 0) {
    leftOpenAccordions.value = leftItems.map(item => item.slot);
  }
  
  // Initialize right column accordions - all open by default
  if (rightOpenAccordions.value.length === 0 && rightItems.length > 0) {
    rightOpenAccordions.value = rightItems.map(item => item.slot);
  }
}, { immediate: true });

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