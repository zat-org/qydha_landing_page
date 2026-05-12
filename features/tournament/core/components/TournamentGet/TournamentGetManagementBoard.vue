<template>
  <div class="mt-4 space-y-12 px-4 pb-8 sm:px-8">
    <!-- لوحة المسار والإجراءات: إدارة سريعة + خط زمني + إجراءات المرحلة -->
    <section
      class="space-y-8 rounded-2xl border border-gray-200/90 bg-gradient-to-b from-white/95 to-gray-50/70 p-4 shadow-md shadow-gray-900/5 ring-1 ring-gray-200/60 dark:border-gray-800 dark:from-gray-950/50 dark:to-gray-950/80 dark:shadow-none dark:ring-gray-800/80 sm:p-6"
      aria-label="لوحة المسار والإجراءات">
      <!-- إدارة سريعة -->
      <div>
        <div class="mb-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">إدارة سريعة</h2>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              اختصارات دائمة — الطاولات، الحكام في أي مرحلة
            </p>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <UButton :to="`/tournament/${id}/table`" label="الطاولات" icon="i-mdi-table" size="lg" variant="soft"
            color="neutral" class="min-h-12 w-full justify-center sm:justify-start" block />
          <UButton :to="`/tournament/${id}/refree`" label="الحكام" icon="i-mdi-gavel" size="lg" variant="soft"
            color="neutral" class="min-h-12 w-full justify-center sm:justify-start" block />
          <!-- <UButton :to="`/tournament/${id}/moderator`" label="المشرفين" icon="i-mdi-shield-account" size="lg"
            variant="soft" color="neutral" class="min-h-12 w-full justify-center sm:justify-start" block /> -->
        </div>
      </div>

      <div class="border-t border-dashed border-gray-200/90 dark:border-gray-700/90" aria-hidden="true" />

      <!-- مسار البطولة -->
      <div aria-label="مسار البطولة">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <span class="h-1 w-10 shrink-0 rounded-full bg-primary" />
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">مسار البطولة</h2>
          </div>
          <p class="hidden text-[11px] text-gray-500 dark:text-gray-400 sm:block">مرّر أفقياً لرؤية كل المراحل</p>
        </div>
        <div
          class="rounded-2xl border border-gray-200/90 bg-white/70 px-2 py-4 dark:border-gray-700/90 dark:bg-gray-900/40 sm:px-4">
          <div class="-mx-1 overflow-x-auto scroll-smooth overscroll-x-contain px-1 pb-2 touch-pan-x" dir="rtl">
            <div class="flex min-w-max items-start gap-0 py-1">
              <template v-for="(phase, idx) in phaseOrder" :key="phase">
                <div class="flex w-[108px] shrink-0 snap-center flex-col items-center sm:w-[112px]">
                  <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm transition-all duration-200"
                    :class="phaseCircleClass(idx)">
                    <UIcon v-if="phaseStepStatus(idx) === 'done'" name="i-mdi-check" class="size-5" />
                    <span v-else>{{ idx + 1 }}</span>
                  </div>
                  <span
                    class="mt-2 max-w-[112px] px-0.5 text-center text-[11px] leading-snug transition-colors sm:text-xs"
                    :class="phaseStepStatus(idx) === 'current'
                        ? 'font-bold text-primary dark:text-primary'
                        : phaseStepStatus(idx) === 'done'
                          ? 'font-medium text-gray-800 dark:text-gray-200'
                          : 'text-gray-500 dark:text-gray-400'
                      ">
                    {{ PHASE_LABELS_AR[phase] }}
                  </span>
                </div>
                <div v-if="idx < phaseOrder.length - 1"
                  class="mt-[26px] h-0.5 w-5 shrink-0 rounded-full transition-colors sm:w-8"
                  :class="idx < currentPhaseIndex ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'" aria-hidden="true" />
              </template>
            </div>
          </div>
          <p class="mt-1 text-center text-[11px] text-gray-500 dark:text-gray-400 sm:hidden">
            اسحب بإصبعك لعرض بقية المراحل
          </p>
        </div>
      </div>

      <div class="border-t border-dashed border-gray-200/90 dark:border-gray-700/90" aria-hidden="true" />

      <!-- المرحلة الحالية والإجراءات -->
      <div aria-label="المرحلة الحالية">
        <div
          class="space-y-5 rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-primary/[0.06] to-white/90 p-5 shadow-inner dark:border-primary/35 dark:from-primary/15 dark:to-gray-950/90 sm:p-6">
          <div class="flex flex-wrap items-center gap-3 border-b border-gray-200/80 pb-3 dark:border-gray-800/80">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <UIcon name="i-mdi-flag-checkered" class="size-6" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">المرحلة الحالية — ماذا تفعل الآن؟</p>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <UBadge v-if="detailedState" color="primary" variant="solid" size="lg">
                  {{ PHASE_LABELS_AR[detailedState] }}
                </UBadge>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 v-if="phaseBehavior.content.heading" class="text-base font-semibold text-gray-800 dark:text-gray-100">
              {{ phaseBehavior.content.heading }}
            </h3>
            <p v-if="phaseBehavior.content.description"
              class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {{ phaseBehavior.content.description }}
            </p>
            <UAlert v-if="phaseBehavior.content.alert" :color="phaseBehavior.content.alert.color" variant="subtle"
              :title="phaseBehavior.content.alert.title" :description="phaseBehavior.content.alert.description" />
            <div v-if="visiblePhaseActions.length" class="flex flex-col flex-wrap gap-3 sm:flex-row">
              <UButton v-for="action in visiblePhaseActions" :key="`${phaseBehavior.panel}-${action.label}`"
                :to="action.to ? `/tournament/${id}${action.to}` : undefined" :label="action.label" :icon="action.icon"
                :target="action.target" :variant="action.variant ?? 'soft'" :color="action.color" size="lg"
                :class="action.className ?? 'w-full min-h-12 justify-center sm:w-auto'"
                :loading=" isStartFinalGroupPending || isResetFinalGroupMatchesPending || isFinishTournamentPending || isResumeFinalGroupAfterFinishPending"
                :disabled=" isStartFinalGroupPending || isResetFinalGroupMatchesPending || isFinishTournamentPending || isResumeFinalGroupAfterFinishPending"
                 block
                @click="handlePhaseAction(action.event)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { TournamentDetailedState } from "~/features/tournament/models/tournament";
import {
  PHASE_LABELS_AR,
  type PhaseStepStatus,
} from "~/features/tournament/core/composables/useTournamentDashboardPhase";
import type {
  TournamentPhaseAction,
  TournamentPhaseBehavior,
} from "~/features/tournament/core/composables/useTournamentGetPhaseBehavior";

const props = defineProps<{
  id: string;
  detailedState: TournamentDetailedState | undefined;
  phaseBehavior: TournamentPhaseBehavior;
  phaseOrder: TournamentDetailedState[];
  currentPhaseIndex: number;
  phaseCircleClass: (idx: number) => string;
  phaseStepStatus: (idx: number) => PhaseStepStatus;
  isStartFinalGroupPending: boolean;
  isResetFinalGroupMatchesPending: boolean;
  isFinishTournamentPending: boolean;
  isResumeFinalGroupAfterFinishPending: boolean;
}>();

const emit = defineEmits<{
  "organize-tournament": [];
  "open-start-confirm": [];
  "reset-final-group-matches": [];
  "finish-tournament": [];
  "resume-final-group-after-finish": [];
}>();

const visiblePhaseActions = computed(() =>
  props.phaseBehavior.content.actions.filter((action) => {
    if (!action.visibleWhen) return true;
    return !!props.phaseBehavior[action.visibleWhen];
  }),
);

const handlePhaseAction = (event?: TournamentPhaseAction["event"]) => {
  if (!event) return;
  console.log(typeof emit) 
  emit(event as keyof typeof emit);

};
</script>
