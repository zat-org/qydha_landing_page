<template>
  <div
    dir="rtl"
    class="match-node--obs flex w-[800px] flex-col gap-0 overflow-hidden rounded-2xl p-3 text-2xl font-bold opacity-100 shadow-sm ring-1 ring-black/5 transition-all duration-300 dark:ring-white/10"
    :class="[vm.cardToneClass, requesterMatchClass]"
  >
    <div class="grid grid-cols-[minmax(0,0.9fr)_auto_minmax(0,0.9fr)] items-stretch gap-3">
      <div
        :class="[
          firstTeamSurfaceClass,
          'group min-w-0 rounded-xl px-3 py-3 ring-1 ring-black/5 transition-all duration-200 dark:ring-white/10',
        ]"
      >
        <div class="flex min-h-[64px] h-full items-center justify-center gap-1">
          <div class="flex h-full grow flex-col items-center justify-center">
            <span
              class="truncate text-center text-3xl font-black leading-tight"
              :class="vm.firstTeamNameClasses"
            >
              {{ usTeamPrimary }}
            </span>
            <p
              v-if="usTeamSecondary.trim()"
              class="truncate text-center text-2xl font-black leading-tight"
            >
              {{ usTeamSecondary }}
            </p>
          </div>
        </div>
      </div>

      <div
        dir="ltr"
        class="inline-flex min-w-20 flex-col items-center justify-center gap-1 self-center rounded-2xl bg-white px-4 py-2 text-slate-700 shadow-sm ring-1 ring-black/10 dark:bg-black dark:text-slate-100 dark:ring-white/10"
      >
        <template v-if="showScore">
          <div class="flex items-center gap-1.5">
            <span class="text-3xl font-black tabular-nums leading-none">{{
              themScore ?? 0
            }}</span>
            <span class="text-xl font-bold opacity-40">:</span>
            <span class="text-3xl font-black tabular-nums leading-none">{{
              usScore ?? 0
            }}</span>
          </div>
          <div
            v-if="showMoshtaraScore"
            class="flex items-center gap-1.5 border-t border-slate-200 pt-1 dark:border-white/15"
          >
            <span class="text-lg font-bold tabular-nums leading-none text-slate-500 dark:text-slate-300">{{
              themMoshtaraScore ?? 0
            }}</span>
            <span class="text-sm font-semibold opacity-35">:</span>
            <span class="text-lg font-bold tabular-nums leading-none text-slate-500 dark:text-slate-300">{{
              usMoshtaraScore ?? 0
            }}</span>
          </div>
        </template>
        <template v-else>
          <span class="text-2xl font-black tracking-wide">VS</span>
        </template>
      </div>

      <div
        :class="[
          secondTeamSurfaceClass,
          'group min-w-0 rounded-xl px-3 py-3 ring-1 ring-black/5 transition-all duration-200 dark:ring-white/10',
        ]"
      >
        <div class="flex min-h-[64px] items-center justify-center gap-1">
          <div class="flex h-full grow flex-col items-center justify-center">
            <span
              class="truncate text-center text-3xl font-black leading-tight"
              :class="vm.secondTeamNameClasses"
            >
              {{ themTeamPrimary }}
            </span>
            <p
              v-if="themTeamSecondary.trim()"
              class="truncate text-center text-2xl font-black leading-tight"
            >
              {{ themTeamSecondary }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Match } from "@/features/tournament/models/group";
import { useMatchNodeShared } from "~/features/tournament/bracket/composables/useMatchNodeShared";

const props = defineProps<{ data: { match: Match; showLogo?: boolean } }>();

const match = computed(() => props.data.match);

const {
  vm,
  requesterMatchClass,
  usTeamPrimary,
  usTeamSecondary,
  themTeamPrimary,
  themTeamSecondary,
  firstTeamSurfaceClass,
  secondTeamSurfaceClass,
  showScore,
  showMoshtaraScore,
  usScore,
  themScore,
  usMoshtaraScore,
  themMoshtaraScore,
} = useMatchNodeShared(match);
</script>
