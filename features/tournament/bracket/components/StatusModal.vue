<template>
  <UModal
    class="status-modal max-w-4xl sm:max-w-2xl"
    title="الاحصائيات"
    description="الاحصائيات للمباراة"
    :ui="{ body: 'p-0 px-0 py-0 sm:p-0' }"
  >
    <template #body>
      <UTabs
        :items="items"
        class="w-full p-2 sm:p-4 md:p-5"
        :ui="{
          list: 'overflow-x-auto [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]',
        }"
      >
        <template #status>
          <div
            class="my-2 w-full max-w-full mx-auto sm:my-3 px-2 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5 border-2 sm:border-[2.5px] lg:border-[3px] border-slate-800 dark:border-slate-700 rounded-xl sm:rounded-2xl bg-linear-to-b from-slate-50 via-slate-100 to-slate-200/80 dark:from-zinc-900 dark:via-zinc-950 dark:to-black shadow-[0_8px_24px_rgba(15,23,42,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-[background,box-shadow,border-color] duration-300"
          >
            <div
              class="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4"
            >
              <div
                class="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 w-full px-1"
              >
                <span class="max-w-36 sm:max-w-48 truncate">{{
                  themTeamPrimary
                }}</span>

                <span
                  class="shrink-0 text-base sm:text-xl md:text-2xl font-extrabold italic leading-none text-slate-800 dark:text-white dark:drop-shadow-md"
                  aria-hidden="true"
                >
                  Vs
                </span>
                <span class="max-w-36 sm:max-w-48 truncate">{{
                  usTeamPrimary
                }}</span>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <div
                v-for="row in statRows"
                :key="row.key"
                class="grid gap-1 sm:gap-1.5 md:gap-2 grid-cols-[minmax(2rem,1fr)_minmax(0,1.45fr)_minmax(2rem,1fr)] min-[480px]:grid-cols-[minmax(2.5rem,1fr)_minmax(0,1.55fr)_minmax(2.5rem,1fr)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.85fr)_minmax(0,1.1fr)]"
              >
                <div
                  class="flex items-center justify-center min-h-8 px-1 sm:px-2 rounded-md sm:rounded-lg bg-white text-slate-900 border border-slate-200/90 dark:bg-slate-50 dark:text-slate-900 dark:border-white/10 text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-center shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-colors duration-300"
                >
                  {{ row.them ?? 0 }}
                </div>
                <div
                  class="flex items-center justify-center min-h-8 px-1 sm:px-1.5 rounded-md sm:rounded-lg bg-linear-to-b from-slate-800 to-slate-900 text-white text-[10px] sm:text-xs md:text-sm font-bold text-center leading-tight wrap-break-word hyphens-auto"
                >
                  {{ row.label }}
                </div>
                <div
                  class="flex items-center justify-center min-h-8 px-1 sm:px-2 rounded-md sm:rounded-lg bg-white text-slate-900 border border-slate-200/90 dark:bg-slate-50 dark:text-slate-900 dark:border-white/10 text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-center shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-colors duration-300"
                >
                  {{ row.us ?? 0 }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #news>
          <div
            class="news-tab flex min-h-[50vh] max-h-[min(70vh,32rem)] w-full flex-col gap-3 p-2 sm:max-h-[500px] sm:gap-4 sm:p-4"
          >
            <div
              class="mx-auto w-full max-w-2xl shrink-0 rounded-xl border border-slate-200/90 bg-white/80 px-3 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/50 sm:rounded-2xl sm:px-4 sm:py-5"
            >
              <div
                class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4"
              >
                <div
                  class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 pt-1 text-center sm:gap-1.5"
                >
                  <span
                    class="absolute -top-1 inset-s-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums sm:text-xs"
                    :class="newsScoreBadgeClass('Them')"
                  >
                    {{ game?.game.themGameScore ?? 0 }} صكة
                  </span>
                  <p
                    class="w-full truncate text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-base md:text-lg"
                  >
                    {{ themTeamPrimary }}
                  </p>
                  <p
                    v-if="themTeamSecondary"
                    class="w-full truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm"
                  >
                    {{ themTeamSecondary }}
                  </p>
                </div>

                <span
                  class="shrink-0 self-center text-sm font-extrabold italic leading-none text-slate-400 dark:text-slate-500 sm:text-lg"
                  aria-hidden="true"
                >
                  Vs
                </span>

                <div
                  class="relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 pt-1 text-center sm:gap-1.5"
                >
                  <span
                    class="absolute -top-1 inset-e-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums sm:text-xs"
                    :class="newsScoreBadgeClass('Us')"
                  >
                    {{ game?.game.usGameScore ?? 0 }} صكة
                  </span>
                  <p
                    class="w-full truncate text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-base md:text-lg"
                  >
                    {{ usTeamPrimary }}
                  </p>
                  <p
                    v-if="usTeamSecondary"
                    class="w-full truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm"
                  >
                    {{ usTeamSecondary }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-if="newsSakkas.length"
              class="news-sakkas-scroll mx-auto min-h-0 w-full max-w-2xl flex-1 space-y-2 overflow-y-auto overscroll-y-contain scrollbar-thin pe-0.5 sm:pe-1"
            >
              <UAccordion
                v-for="(sakka, sakkaIndex) in newsSakkas"
                :key="sakka.id"
                type="single"
                collapsible
                :items="[
                  {
                    value: String(sakka.id),
                    slot: `sakka-${sakka.id}`,
                    label: '',
                  },
                ]"
                :default-value="sakkaIndex === 0 ? String(sakka.id) : undefined"
                class="rounded-xl border border-slate-200/90 bg-white/90 dark:border-slate-700 dark:bg-slate-900/45"
                :ui="{
                  item: 'border-0',
                  header: 'p-0 w-full ',
                  label: 'w-full',
                  trigger:
                    'group flex w-full items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-slate-50/80 dark:hover:bg-slate-950/40',
                  trailingIcon:
                    'size-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300',
                  body: 'border-t border-slate-200/80 dark:border-slate-700',
                  content: 'px-3 py-2 sm:px-4 sm:py-3',
                }"
              >
                <template #default>
                  <div
                    dir="ltr"
                    class="grid min-w-0 w-full flex-1 grid-cols-[minmax(2.5rem,1fr)_auto_minmax(2.5rem,1fr)] items-center gap-2"
                  >
                    <div :class="newsSakkaScoreCellClass(sakka.winner, 'Them')">
                      {{ sakka.themSakkaScore }}
                    </div>
                    <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                      الصكة {{ reversedItemNumber(newsSakkas.length, sakkaIndex) }}
                    </span>
                    <div :class="newsSakkaScoreCellClass(sakka.winner, 'Us')">
                      {{ sakka.usSakkaScore }}
                    </div>
                  </div>
                </template>

                <template #[`sakka-${sakka.id}`]>
                  <div
                    v-if="sakka.moshtaras?.length"
                    class="divide-y divide-slate-100 dark:divide-slate-800"
                  >
                    <div
                      v-for="(mos, mosIndex) in reversedMoshtaras(sakka.moshtaras)"
                      :key="mos.id"
                      dir="ltr"
                      class="grid grid-cols-[minmax(2.5rem,1fr)_auto_minmax(2.5rem,1fr)] items-center gap-2 py-2 first:pt-0 last:pb-0"
                    >
                      <span
                        class="text-center text-base font-bold tabular-nums sm:text-lg"
                        :class="newsMoshtaraScoreClass(mos)"
                      >
                        {{ mos.state === "Running" ? "—" : mos.themAbnat }}
                      </span>

                      <UBadge size="xs" color="neutral" variant="subtle">
                        {{
                          mos.state === "Running"
                            ? `جارية ${reversedItemNumber(sakka.moshtaras.length, mosIndex)}`
                            : reversedItemNumber(sakka.moshtaras.length, mosIndex)
                        }}
                      </UBadge>

                      <span
                        class="text-center text-base font-bold tabular-nums sm:text-lg"
                        :class="newsMoshtaraScoreClass(mos)"
                      >
                        {{ mos.state === "Running" ? "—" : mos.usAbnat }}
                      </span>
                    </div>
                  </div>

                  <p
                    v-else
                    class="py-1 text-center text-xs text-slate-500 dark:text-slate-400 sm:text-sm"
                  >
                    لا توجد مشtريات
                  </p>
                </template>
              </UAccordion>
            </div>

            <div
              v-else
              class="mx-auto flex min-h-32 w-full max-w-2xl flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/80 bg-slate-50/50 px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900/30"
            >
              <UIcon
                name="i-mdi-cards-playing-outline"
                class="mb-2 h-8 w-8 text-slate-400"
              />
              <p class="text-sm text-slate-500 dark:text-slate-400">
                لا توجد بيانات للنشرة بعد
              </p>
            </div>
          </div>
        </template>
      </UTabs>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Match } from "~/features/tournament/models/group";
import type { IMathStat } from "~/features/tournament/models/MatchStat";
import { useTournamentBracketStore } from "~/features/tournament/bracket/stores";

const props = defineProps<{ m: Match }>();
const gameStore = useTournamentBracketStore();

const start = async () => {
  const selectedGame = gameStore.games.find(
    (g) => g.id === props.m.qydhaGameId,
  );
  if (!selectedGame) {
    await gameStore.fetchGame(props.m.qydhaGameId);
  }
};
await start();

const game = computed(() =>
  gameStore.games.find((g) => g.id === props.m.qydhaGameId),
);
const newsSakkas = computed(() =>
  [...(game.value?.game.sakkas ?? [])].reverse(),
);
const statusUs = computed(() => game.value?.statistics.usStatistics);
const statusThem = computed(() => game.value?.statistics.themStatistics);

function teamPrimaryName(teamName: string) {
  const [primary] = teamName
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  return primary || teamName;
}

function teamSecondaryName(teamName: string) {
  const [, secondary] = teamName
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  return secondary ?? "";
}

const themTeamPrimary = computed(() => teamPrimaryName(props.m.themTeamName));
const usTeamPrimary = computed(() => teamPrimaryName(props.m.usTeamName));
const themTeamSecondary = computed(() => teamSecondaryName(props.m.themTeamName));
const usTeamSecondary = computed(() => teamSecondaryName(props.m.usTeamName));

function normalizeGameSide(
  value: string | null | undefined,
): "Us" | "Them" | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized === "us") return "Us";
  if (normalized === "them") return "Them";
  return null;
}

function newsScoreBadgeClass(side: "Us" | "Them") {
  const winner = normalizeGameSide(game.value?.game.winner);
  if (!winner) {
    return "bg-slate-200/90 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
  }
  if (winner === side) {
    return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300/60 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-700/50";
  }
  return "bg-rose-100 text-rose-700 ring-1 ring-rose-200/60 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-800/50";
}

function newsSakkaScoreCellClass(
  winner: string | null | undefined,
  side: "Us" | "Them",
) {
  const base =
    "flex min-h-9 min-w-9 items-center justify-center rounded-lg border px-2 py-1 text-lg font-extrabold tabular-nums sm:min-h-10 sm:text-xl";
  const normalizedWinner = normalizeGameSide(winner);

  if (!normalizedWinner) {
    return `${base} border-slate-200/90 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-50 dark:text-slate-900`;
  }
  if (normalizedWinner === side) {
    return `${base} border-emerald-300/90 bg-emerald-100 text-emerald-900 dark:border-emerald-700/70 dark:bg-emerald-950/50 dark:text-emerald-100`;
  }
  return `${base} border-rose-200/90 bg-rose-100 text-rose-800 dark:border-rose-800/70 dark:bg-rose-950/45 dark:text-rose-100`;
}

function newsMoshtaraScoreClass(mos: { state: string }) {
  if (mos.state === "Running") {
    return "text-slate-400 dark:text-slate-500";
  }
  return "text-slate-900 dark:text-slate-100";
}

function reversedItemNumber(total: number, reversedIndex: number) {
  return total - reversedIndex;
}

function reversedMoshtaras<
  T extends { id: number; usAbnat: number; themAbnat: number; state: string },
>(moshtaras: T[]) {
  return [...moshtaras].reverse();
}

type StatKey = keyof IMathStat["usStatistics"];

const statDefinitions: { key: StatKey; label: string }[] = [
  { key: "ekak", label: "عدد الاكك" },
  { key: "aklat", label: "الاكلات" },
  { key: "moshtaraSunCount", label: "مشترى صن" },
  { key: "moshtaraHokmCount", label: "مشترى حكم" },
  { key: "wonMoshtaraCount", label: "مشتريات ناجحة" },
  { key: "lostMoshtaraCount", label: "مشتريات خسرانة" },
  { key: "sra", label: "سرا" },
  { key: "baloot", label: "بلوت" },
  { key: "khamsen", label: "خمسين" },
  { key: "me2a", label: "مية" },
  { key: "rob3ome2a", label: "أربعمية" },
  { key: "sunKaboot", label: "عدد الكبوت صن" },
  { key: "hokmKaboot", label: "عدد الكبوت حكم" },
];

const statRows = computed(() =>
  statDefinitions.map(({ key, label }) => ({
    key,
    label,
    them: statusThem.value?.[key],
    us: statusUs.value?.[key],
  })),
);

const items = [
  { slot: "news", label: "النشرة" },
  { slot: "status", label: "الاحصائيات" },
];
</script>
