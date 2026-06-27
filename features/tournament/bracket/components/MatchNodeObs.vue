<template>
  <div
    dir="rtl"
    class="match-node--obs flex w-[580px] flex-col gap-0 overflow-hidden rounded-2xl p-3 text-lg font-semibold shadow-sm ring-1 ring-black/5 backdrop-blur-[1px] transition-all duration-300 dark:bg-gray-800 dark:ring-white/10"
    :class="[vm.cardToneClass, roundOpacityClass]"
  >
    <div class="grid grid-cols-[minmax(0,0.9fr)_auto_minmax(0,0.9fr)] items-stretch gap-3">
      <div
        :class="[
          firstTeamSurfaceClass,
          'group min-w-0 rounded-xl px-3 py-3 ring-1 ring-black/5 transition-all duration-200 dark:ring-white/10',
        ]"
      >
        <div class="flex min-h-[52px] h-full items-center justify-center gap-1">
          <div class="flex h-full grow flex-col items-center justify-center">
            <span
              class="truncate text-center text-xl font-bold leading-tight"
              :class="vm.firstTeamNameClasses"
            >
              {{ usTeamPrimary }}
            </span>
            <p
              v-if="usTeamSecondary.trim()"
              class="truncate text-center text-lg font-bold leading-tight"
            >
              {{ usTeamSecondary }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="inline-flex items-center justify-center self-center rounded-full bg-white/80 px-4 py-2 text-base font-black text-slate-700 ring-1 ring-black/10 dark:bg-black/35 dark:text-slate-100 dark:ring-white/10"
      >
        VS
      </div>

      <div
        :class="[
          secondTeamSurfaceClass,
          'group min-w-0 rounded-xl px-3 py-3 ring-1 ring-black/5 transition-all duration-200 dark:ring-white/10',
        ]"
      >
        <div class="flex min-h-[52px] items-center justify-center gap-1">
          <div class="flex h-full grow flex-col items-center justify-center">
            <span
              class="truncate text-center text-xl font-bold leading-tight"
              :class="vm.secondTeamNameClasses"
            >
              {{ themTeamPrimary }}
            </span>
            <p
              v-if="themTeamSecondary.trim()"
              class="truncate text-center text-lg font-bold leading-tight"
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
  roundOpacityClass,
  usTeamPrimary,
  usTeamSecondary,
  themTeamPrimary,
  themTeamSecondary,
  firstTeamSurfaceClass,
  secondTeamSurfaceClass,
} = useMatchNodeShared(match);
</script>
