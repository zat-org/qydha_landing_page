<template>
  <section
    class="mx-4 mt-5 rounded-2xl border border-amber-200/80 bg-linear-to-b from-amber-50/85 to-white p-4 shadow-sm dark:border-amber-700/40 dark:from-amber-900/20 dark:to-gray-950/30 sm:mx-8 sm:p-5"
  >
    <div class="mb-3 flex items-center gap-2">
      <UIcon name="i-mdi-trophy-award" class="size-5 text-amber-500 dark:text-amber-400" />
      <h3 class="text-base font-bold text-gray-900 dark:text-white">الفائزون</h3>
    </div>
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="winner in winners"
        :key="winner.teamId"
        class="rounded-xl border border-amber-200/70 bg-white/90 p-3 shadow-sm dark:border-amber-700/40 dark:bg-gray-900/60"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-bold text-gray-900 dark:text-white">
            المركز {{ winner.order }}
          </p>
          <UBadge color="warning" variant="soft" size="sm">#{{ winner.order }}</UBadge>
        </div>
        <p class="mt-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
          {{ winner.teamName }}
        </p>
      </article>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { TournamentWinner } from '~/features/tournament/models/tournament';

defineProps<{
  winners: TournamentWinner[];
}>();
</script>
