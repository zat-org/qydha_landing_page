<template>
  <div
    class="statistics-page"
    :class="obsMode ? 'statistics-page--obs' : 'min-h-screen'"
  >
    <UCard v-if="!obsMode" class="mx-auto w-full" :ui="cardUi">
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
            <!-- <UBadge
              v-if="totalGames !== null"
              color="primary"
              size="xl"
              variant="soft"
              class="px-4 py-2 text-base font-bold sm:text-xl md:text-2xl"
            >
              عدد الألعاب: {{ totalGames }}
            </UBadge> -->
            <ClientOnly>
              <UDropdownMenu
                :items="themeMenuItems"
                :popper="{ placement: 'bottom-start' }"
              >
                <button
                  type="button"
                  class="rounded border px-3 py-1.5 text-xs font-semibold transition-colors"
                  :class="
                    isDark
                      ? 'border-gray-800 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  "
                  aria-label="اختيار الثيم"
                >
                  <span class="inline-flex items-center gap-1">
                    <template v-if="isDark">🌙</template>
                    <template v-else>☀️</template>
                    <UIcon
                      name="i-heroicons-chevron-down-20-solid"
                      class="size-3.5 opacity-70"
                    />
                  </span>
                </button>
              </UDropdownMenu>
            </ClientOnly>
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

      <div
        v-else-if="hasStatistics"
        class="mx-auto w-full max-w-4xl p-2 sm:p-4"
        dir="rtl"
      >
        <div class="stats-panel w-full max-w-full">
          <div class="stats-panel__frame">
            <div class="flex flex-col gap-2 sm:gap-3">
              <div
                v-for="row in statRows"
                :key="row.key"
                class="stats-panel__row"
              >
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

    <div v-else class="statistics-page__obs-content">
      <div v-if="error" class="flex flex-col items-center justify-center py-12">
        <UIcon name="i-mdi-alert-circle" class="mb-4 h-16 w-16 text-red-500" />
        <p class="text-lg text-gray-600 dark:text-gray-400">
          حدث خطأ أثناء تحميل الإحصائيات
        </p>
        <UButton class="mt-4" color="primary" variant="soft" @click="refresh">
          إعادة المحاولة
        </UButton>
      </div>

      <div
        v-else-if="hasStatistics"
        class="statistics-page__obs-body mx-auto w-full max-w-4xl"
        dir="rtl"
      >
        <div class="stats-panel stats-panel--obs w-full max-w-full">
          <div class="stats-panel__frame stats-panel__frame--obs">
            <div class="stats-panel__obs-header  justify-center">
              <img
                :src="qydhaLogo"
                alt="قيدها"
                class="stats-panel__obs-logo"
                loading="lazy"
                decoding="async"
              />
              <h1 class="stats-panel__obs-title ">احصائيات البطوله</h1>
              <!-- <UBadge
                v-if="totalGames !== null"
                color="primary"
                size="lg"
                variant="soft"
                class="stats-panel__obs-badge shrink-0"
              >
                عدد الألعاب: {{ totalGames }}
              </UBadge> -->
            </div>
            <div class="stats-panel__obs-rows">
              <div
                v-for="row in statRows"
                :key="row.key"
                class="stats-panel__row stats-panel__row--obs"
              >
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import qydhaLogo from "~/assets/images/qydha-logo.svg";
import type { TournamentStatistics } from "~/features/tournament/models/tournament";
import { useMyAuthStore } from "~/store/Auth";

type StatKey = keyof TournamentStatistics["statistics"];
type PageTheme = "dark" | "light";

const OBS_MODE_QUERY = "obsMode";
const THEME_QUERY = "theme";
const STATISTICS_OBS_THEME_KEY = "statistics-overlay-theme";

function parseObsModeQuery(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  if (Array.isArray(value)) return parseObsModeQuery(value[0]);
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
    if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  }
  return false;
}

function parseThemeQuery(value: unknown): PageTheme | null {
  if (Array.isArray(value)) return parseThemeQuery(value[0]);
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "dark" || normalized === "light") return normalized;
  return null;
}

const route = useRoute();
const router = useRouter();
const id = route.params.id?.toString() || "";

const obsMode = computed<boolean>(() =>
  parseObsModeQuery(route.query[OBS_MODE_QUERY]),
);

const cardUi = {
  root: "w-full min-h-screen flex flex-col",
  body: "flex-1 overflow-y-auto",
};

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

function applyTheme(theme: PageTheme) {
  if (colorMode?.forced) return;
  colorMode.preference = theme;
}

function setTheme(theme: PageTheme) {
  if (colorMode?.forced) return;
  applyTheme(theme);
}

function goToObsMode(theme: PageTheme) {
  if (!import.meta.client) return;
  localStorage.setItem(STATISTICS_OBS_THEME_KEY, theme);
  const resolved = router.resolve({
    path: route.path,
    query: { ...route.query, [OBS_MODE_QUERY]: "true", [THEME_QUERY]: theme },
  });
  window.open(resolved.href, "_blank", "noopener,noreferrer");
}

const userStore = useMyAuthStore();
const canUseObsMode = computed(
  () => !!userStore.user && (userStore.isStaffAdmin || userStore.isSuperAdmin),
);

const themeMenuItems = computed<DropdownMenuItem[][]>(() => {
  const items: DropdownMenuItem[][] = [
    [
      {
        label: "فاتح",
        icon: "i-heroicons-sun-20-solid",
        onSelect: () => setTheme("light"),
      },
      {
        label: "داكن",
        icon: "i-heroicons-moon-20-solid",
        onSelect: () => setTheme("dark"),
      },
    ],
  ];

  if (canUseObsMode.value) {
    items.push([
      {
        label: "OBS فاتح",
        icon: "i-heroicons-tv",
        onSelect: () => goToObsMode("light"),
      },
      {
        label: "OBS داكن",
        icon: "i-heroicons-tv",
        onSelect: () => goToObsMode("dark"),
      },
    ]);
  }

  return items;
});

watch(
  () => route.query[THEME_QUERY],
  (raw) => {
    const theme = parseThemeQuery(raw);
    if (theme) applyTheme(theme);
  },
  { immediate: true },
);

function applyObsDocumentClass(active: boolean) {
  if (!import.meta.client) return;
  document.documentElement.classList.toggle("statistics-obs", active);
}

watch(obsMode, (active) => applyObsDocumentClass(active), { immediate: true });

onUnmounted(() => {
  applyObsDocumentClass(false);
});

const statsReq = await useTournamentStatistics(id);

const error = computed(() => statsReq.error.value);

const apiData = computed(() => statsReq.data.value ?? null);
const statistics = computed<Partial<TournamentStatistics["statistics"]>>(
  () => apiData.value?.data?.statistics ?? apiData.value?.data ?? {},
);
const totalGames = computed<number | null>(
  () => (apiData.value?.data?.totalGames ?? null) as number | null,
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

const statKeys: StatKey[] = [
  "playedSakkas",
  "winnedSakkas",
  "lostSakka",
  "moshtaraSunCount",
  "moshtaraHokmCount",
  "wonMoshtaraCount",
  "lostMoshtaraCount",
  "sunKaboot",
  "hokmKaboot",
  "sra",
  "baloot",
  "khamsen",
  "me2a",
  "rob3ome2a",
  "ekak",
  "aklat",
];

const hasStat = (key: StatKey): boolean => {
  const stats = statistics.value as Record<string, number>;
  return stats[key] !== undefined && stats[key] !== null;
};

const statRows = computed(() =>
  statKeys
    .filter((key) => hasStat(key))
    .map((key) => ({
      key,
      label: labels[key],
      value: statistics.value[key] ?? 0,
    })),
);

const hasStatistics = computed(() => statRows.value.length > 0);

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
  gap: 0.5rem;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
}

@media (min-width: 480px) {
  .stats-panel__row {
    gap: 0.625rem;
    grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  }
}

@media (min-width: 640px) {
  .stats-panel__row {
    gap: 0.75rem;
    grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-panel__row {
    gap: 1rem;
    grid-template-columns: minmax(0, 1.85fr) minmax(0, 1fr);
  }
}

.stats-panel__value,
.stats-panel__label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  text-align: center;
  border-radius: 0.5rem;
  transition: background-color 0.3s, color 0.3s;
}

@media (min-width: 640px) {
  .stats-panel__value,
  .stats-panel__label {
    min-height: 3rem;
    border-radius: 0.625rem;
  }
}

@media (min-width: 1024px) {
  .stats-panel__value,
  .stats-panel__label {
    min-height: 3.25rem;
  }
}

.stats-panel__value {
  padding: 0 0.5rem;
  background: white;
  color: rgb(15 23 42);
  border: 1px solid rgb(226 232 240 / 0.9);
  font-size: 1.125rem;
  font-weight: 800;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

@media (min-width: 640px) {
  .stats-panel__value {
    padding: 0 0.75rem;
    font-size: 1.375rem;
  }
}

@media (min-width: 768px) {
  .stats-panel__value {
    font-size: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .stats-panel__value {
    font-size: 1.75rem;
  }
}

:global(.dark) .stats-panel__value {
  background: rgb(248 250 252);
  color: rgb(15 23 42);
  border-color: rgb(255 255 255 / 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.stats-panel__label {
  padding: 0 0.5rem;
  background: linear-gradient(to bottom, rgb(30 41 59), rgb(15 23 42));
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: anywhere;
  hyphens: auto;
}

@media (min-width: 640px) {
  .stats-panel__label {
    padding: 0 0.75rem;
    font-size: 1.125rem;
  }
}

@media (min-width: 768px) {
  .stats-panel__label {
    font-size: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .stats-panel__label {
    font-size: 1.375rem;
  }
}

.stats-panel__obs-header {
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  /* justify-content: space-between; */
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgb(30 41 59 / 0.2);
}

:global(.dark) .stats-panel__obs-header {
  border-bottom-color: rgb(255 255 255 / 0.15);
}

.stats-panel__obs-logo {
  width: 4.5rem;
  height: 4.5rem;
  flex-shrink: 0;
  object-fit: contain;
}

.stats-panel__obs-title {
  
  min-width: 0;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
  color: rgb(15 23 42);
}

:global(.dark) .stats-panel__obs-title {
  color: rgb(248 250 252);
}

.stats-panel__obs-badge {
  padding: 0.35rem 0.75rem;
  font-size: 1.125rem;
  font-weight: 800;
}

/* OBS: fixed 1080px canvas — compact header, stat rows fill remaining height */
.statistics-page--obs {
  height: 1080px;
  max-height: 1080px;
  min-height: 1080px;
  overflow: hidden;
  background: none !important;
  background-color: transparent !important;
}

.statistics-page__obs-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  background: none !important;
  background-color: transparent !important;
}

.statistics-page__obs-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  padding: 0;
  background: transparent !important;
}

.stats-panel--obs {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  background: transparent !important;
}

.stats-panel__frame--obs {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 0.75rem 1rem;
  border-width: 3px;
  border-radius: 1rem;
}

.stats-panel__obs-rows {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.375rem;
  min-height: 0;
}

.statistics-page--obs .stats-panel__row--obs {
  flex: 1;
  min-height: 0;
  gap: 0.5rem;
}

.statistics-page--obs .stats-panel__value,
.statistics-page--obs .stats-panel__label {
  min-height: 0;
  height: 100%;
  font-size: 1.25rem;
}

.statistics-page--obs .stats-panel__value {
  font-size: 1.375rem;
}

.statistics-page--obs,
.statistics-page__obs-content {
  background: transparent !important;
  background-color: transparent !important;
}

.statistics-page--obs :deep(.bg-default),
.statistics-page--obs :deep(.bg-elevated),
.statistics-page--obs :deep([data-slot="root"]),
.statistics-page--obs :deep([data-slot="body"]),
.statistics-page--obs :deep([data-slot="header"]) {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  --tw-ring-shadow: 0 0 #0000 !important;
}
</style>

<style>
/* OBS overlay: 1080px canvas, transparent chrome */
html.statistics-obs,
html.statistics-obs body,
html.statistics-obs #__nuxt,
html.statistics-obs #__nuxt > div,
html.statistics-obs [data-vaul-drawer-wrapper],
html.statistics-obs main {
  height: 1080px;
  max-height: 1080px;
  overflow: hidden;
  background: transparent !important;
  background-color: transparent !important;
}

html.statistics-obs .statistics-page,
html.statistics-obs .statistics-page--obs,
html.statistics-obs .statistics-page__obs-content,
html.statistics-obs .statistics-page__obs-body,
html.statistics-obs .stats-panel--obs,
html.statistics-obs .bg-default,
html.statistics-obs .bg-elevated,
html.statistics-obs .bg-muted {
  background: none !important;
  background-color: transparent !important;
}
</style>
