<template>
  <div
    class="relative border-b rounded-2xl border-gray-200/90 dark:border-gray-800 bg-gradient-to-br from-primary/[0.07] via-gray-50/80 to-transparent dark:from-primary/15 dark:via-gray-950/50 dark:to-transparent px-4 sm:px-8 pt-4 pb-8 sm:pb-10">
    <!-- بيانات البطولة — UAccordion (مصغّر في الرأس، يكبر عند الفتح) -->
    <UAccordion v-model="heroAccordionOpen" type="single" collapsible :items="heroAccordionItems"
      class="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white/75 dark:bg-gray-900/45 shadow-lg shadow-gray-900/[0.06] dark:shadow-none overflow-hidden ring-1 ring-gray-200/40 dark:ring-gray-800/60 backdrop-blur-[2px]"
      :ui="{
        root: 'w-full',
        item: 'border-0 rounded-none bg-transparent shadow-none',
        header: 'p-0',
        trigger:
          'group flex w-full flex-wrap items-center gap-3 sm:gap-4 px-4 py-3.5 sm:px-5 sm:py-4 text-start transition-colors hover:bg-white/95 dark:hover:bg-gray-900/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:focus-visible:ring-offset-gray-950 rounded-none',
        label: 'min-w-0 flex-1 text-start',
        content: 'border-t border-gray-200/85 dark:border-gray-800/90 bg-gradient-to-b from-gray-50/80 to-white/60 px-4 pb-6 pt-5 dark:from-gray-950/50 dark:to-gray-950/80 sm:px-6 sm:pb-8',
      }">
      <template #leading="{ open }">
        <div class="flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16">
          <Transition mode="out-in" enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-90" enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-90">
            <div v-if="!open" key="header-logo"
              class="rounded-xl bg-white p-0.5 shadow-md ring-2 ring-primary/30 dark:bg-gray-900 dark:ring-primary/40">
              <div class="relative h-14 w-14 overflow-hidden rounded-lg sm:h-16 sm:w-16">
                <UAvatar :src="tour.tournament?.logoUrl" :text="tour.tournament?.title"
                  class="h-full w-full object-cover" alt="" />
              </div>
            </div>
          </Transition>
        </div>
      </template>

      <template #default="{ open }">
        <div class="min-w-0 flex-1 text-start">
          <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400">بيانات البطولة</p>
          <p class="truncate text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
            {{ tour.tournament?.title }}
          </p>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {{ open ? 'اضغط لطي التفاصيل' : 'اضغط لعرض الوصف والتواريخ وباقي البيانات' }}
          </p>
        </div>
      </template>

      <template #trailing="{ open }">
        <div class="ms-auto flex shrink-0 items-center">
          <UIcon :name="open ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'"
            class="size-7 text-gray-400 transition-transform duration-200 group-hover:text-primary"
            :class="open ? 'text-primary' : ''" />
        </div>
      </template>

      <template #tournament-hero>
        <div class="space-y-6">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            <div
              class="lg:col-span-4 rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white/90 dark:bg-gray-900/55 p-5 shadow-sm">
              <div class="flex flex-col items-center gap-3 text-center">
                <div
                  class="rounded-2xl bg-white p-1 shadow-lg ring-2 ring-primary/25 dark:bg-gray-900 dark:ring-primary/35">
                  <div class="relative h-[140px] w-[140px] overflow-hidden rounded-xl sm:h-[168px] sm:w-[168px]">
                    <UAvatar :src="tour.tournament?.logoUrl" :text="tour.tournament?.title"
                      class="h-full w-full object-cover" alt="شعار البطولة" />
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">اسم البطولة</p>
                  <h1 class="mt-1 text-xl font-bold leading-tight text-gray-900 dark:text-white sm:text-2xl">
                    {{ tour.tournament?.title }}
                  </h1>
                </div>
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <UBadge v-if="tour.tournament?.state" :color="toBadgeColor(getState(tour.tournament.state)?.color)"
                    variant="soft" size="lg">
                    {{ getState(tour.tournament.state)?.label }}
                  </UBadge>
                  <UBadge v-if="detailedState" color="neutral" variant="outline" size="lg">
                    {{ PHASE_LABELS_AR[detailedState] }}
                  </UBadge>
                  <UBadge v-if="tour.tournament?.tournamentType"
                    :color="toBadgeColor(getType(tour.tournament.tournamentType)?.color, 'primary')" variant="soft"
                    size="lg">
                    {{ getType(tour.tournament.tournamentType)?.label }}
                  </UBadge>
                  <UBadge v-if="tour.tournament?.showInQydha" color="success" variant="soft" size="lg">
                    ظاهر في قيدها
                  </UBadge>
                </div>
              </div>
            </div>

            <div class="lg:col-span-8 rounded-2xl border border-primary/25 bg-primary/[0.03] p-4 dark:bg-primary/10">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">كل بيانات البطولة</p>
              <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div v-if="tour.tournament?.description"
                  class="rounded-xl border border-gray-200/80 bg-white/85 p-3 dark:border-gray-700/80 dark:bg-gray-900/50 sm:col-span-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400">الوصف</p>
                  <p class="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {{ tour.tournament.description }}
                  </p>
                </div>
                <div v-if="tour.tournament?.locationDescription"
                  class="rounded-xl border border-gray-200/80 bg-white/85 p-3 dark:border-gray-700/80 dark:bg-gray-900/50">
                  <p class="text-xs text-gray-500 dark:text-gray-400">الموقع</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{{
                    tour.tournament.locationDescription }}</p>
                </div>
                <div
                  class="rounded-xl border border-gray-200/80 bg-white/85 p-3 dark:border-gray-700/80 dark:bg-gray-900/50">
                  <p class="text-xs text-gray-500 dark:text-gray-400">الفترة الزمنية</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {{ formatDate(tour.tournament?.startAt) }} <span class="text-gray-400">—</span> {{
                      formatDate(tour.tournament?.endAt) }}
                  </p>
                </div>
                <div
                  class="rounded-xl border border-gray-200/80 bg-white/85 p-3 dark:border-gray-700/80 dark:bg-gray-900/50">
                  <p class="text-xs text-gray-500 dark:text-gray-400">عدد الفرق المتوقع</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{{
                    tour.tournament?.expectedTeamsCount ?? '—' }}</p>
                </div>
                <div
                  class="rounded-xl border border-gray-200/80 bg-white/85 p-3 dark:border-gray-700/80 dark:bg-gray-900/50">
                  <p class="text-xs text-gray-500 dark:text-gray-400">عدد الطاولات</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{{
                    tour.tournament?.expectedTablesCount ?? '—' }}</p>
                </div>
                <div v-if="tour.tournament?.joinRequestStartAt || tour.tournament?.joinRequestEndAt"
                  class="rounded-xl border border-gray-200/80 bg-white/85 p-3 dark:border-gray-700/80 dark:bg-gray-900/50">
                  <p class="text-xs text-gray-500 dark:text-gray-400">نافذة الانضمام</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {{ tour.tournament?.joinRequestStartAt ? formatDate(tour.tournament.joinRequestStartAt) : 'غير محدد'
                    }}
                    <span class="text-gray-400">—</span>
                    {{ tour.tournament?.joinRequestEndAt ? formatDate(tour.tournament.joinRequestEndAt) : 'غير محدد' }}
                  </p>
                </div>
                <div v-if="tour.tournament?.joinRequestMaxCount"
                  class="rounded-xl border border-gray-200/80 bg-white/85 p-3 dark:border-gray-700/80 dark:bg-gray-900/50">
                  <p class="text-xs text-gray-500 dark:text-gray-400">الحد الأعلى للانضمام</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{{
                    tour.tournament.joinRequestMaxCount }}</p>
                </div>
                <div v-if="tour.tournament?.contactPhone"
                  class="rounded-xl border border-gray-200/80 bg-white/85 p-3 dark:border-gray-700/80 dark:bg-gray-900/50 sm:col-span-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400">رقم التواصل</p>
                  <div class="mt-1 flex flex-wrap items-center gap-2">
                    <p dir="ltr" class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{
                      tour.tournament.contactPhone }}</p>
                    <UBadge v-if="tour.tournament?.isContactPhoneCall" variant="soft" size="sm">اتصال</UBadge>
                    <UBadge v-if="tour.tournament?.isContactPhoneWhatsapp" color="success" variant="soft" size="sm">
                      واتساب</UBadge>
                  </div>
                </div>
                <div v-if="tour.tournament?.owner"
                  class="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white/85 p-3 dark:border-gray-700/80 dark:bg-gray-900/50 sm:col-span-2">
                  <UAvatar :src="tour.tournament.owner.avatarUrl || undefined"
                    class="shrink-0 ring-2 ring-white dark:ring-gray-800"
                    :alt="tour.tournament.owner.username || tour.tournament.owner.name || 'Owner'" size="lg" />
                  <div class="min-w-0">
                    <p class="text-xs text-gray-500 dark:text-gray-400">مالك البطولة</p>
                    <p class="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {{ tour.tournament.owner.name || tour.tournament.owner.username }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- الرعاة، الجوائز، القواعد، المشرفون — داخل «بيانات البطولة» -->
          <UAccordion v-if="detailsAccordionItems.length" v-model="detailsSectionsOpen" type="multiple"
            :items="detailsAccordionItems" class="w-full" :ui="{
              root: 'space-y-3',
              item: 'rounded-2xl border border-gray-200/95 dark:border-gray-800/95 overflow-hidden bg-white/90 dark:bg-gray-950/45 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-800/70 last:border-b',
              trigger:
                'group/tr flex w-full items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 text-start font-semibold text-gray-900 dark:text-white hover:bg-gray-50/95 dark:hover:bg-gray-900/70 transition-colors min-h-[3.25rem]',
              trailingIcon: 'text-gray-400 group-hover/tr:text-primary transition-colors size-6',
              body: 'border-t border-gray-100 dark:border-gray-800/90 bg-gradient-to-b from-gray-50/90 to-white/80 dark:from-gray-950/40 dark:to-gray-950/70',
              content: 'px-4 pb-5 pt-2 sm:px-5',
            }" aria-label="تفاصيل إضافية للبطولة">
            <template #acc-sponsors>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
                <a v-for="(logoUrl, i) in tour.tournament!.sponsors" :key="i" :href="logoUrl" target="_blank"
                  rel="noopener noreferrer"
                  class="group flex min-h-[5.5rem] flex-col items-center justify-center rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md hover:shadow-primary/5 dark:border-gray-700/90 dark:bg-gray-900/60 dark:hover:border-primary/50">
                  <img :src="logoUrl" :alt="`راعي ${i + 1}`"
                    class="max-h-14 w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100"
                    loading="lazy"
                    @error="(e: Event) => ((e.target as HTMLImageElement).style.visibility = 'hidden')" />
                  <span
                    class="mt-2 text-[10px] text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-500">
                    فتح الرابط
                  </span>
                </a>
              </div>
            </template>

            <template #acc-prizes>
              <div v-if="tour.tournament?.prizes?.length" class="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                <div v-for="(prize, index) in tour.tournament.prizes" :key="index"
                  class="relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4 ps-5 shadow-sm dark:border-gray-700/90 dark:bg-gray-900/55">
                  <span class="absolute inset-y-4 start-0 w-1.5 rounded-e bg-gradient-to-b from-primary to-primary/60"
                    aria-hidden="true" />
                  <div class="flex w-full flex-wrap items-start justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary dark:bg-primary/20">
                        <UIcon name="i-mdi-podium-gold" class="size-5" />
                      </span>
                      <p class="font-bold text-gray-900 dark:text-white">المركز {{ index + 1 }}</p>
                    </div>
                    <p v-if="prize.isFinancial"
                      class="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary dark:bg-primary/15">
                      {{ prize.financialPrizeAmount.toLocaleString() }}
                      {{ getCurrency(prize.financialPrizeCurrency)?.label ?? 'ريال' }}
                    </p>
                  </div>
                  <div v-if="prize.isNonFinancial && prize.nonFinancialPrizes?.length"
                    class="mt-3 flex flex-wrap gap-1.5">
                    <UBadge v-for="(nf, j) in prize.nonFinancialPrizes" :key="j" variant="soft" size="sm">{{ nf }}
                    </UBadge>
                  </div>
                </div>
              </div>
              <div v-else
                class="flex items-center gap-3 rounded-xl border border-dashed border-gray-300/90 bg-gray-50/80 px-4 py-6 dark:border-gray-600/80 dark:bg-gray-900/40">
                <UIcon name="i-mdi-information-outline" class="size-8 shrink-0 text-gray-400" />
                <p class="text-sm text-gray-600 dark:text-gray-400">لا توجد جوائز مسجّلة لهذه البطولة.</p>
              </div>
            </template>

            <template #acc-rules>
              <ul class="m-0 list-none space-y-2.5 p-0">
                <li v-for="(rule, index) in tour.tournament!.tournamentRules" :key="index"
                  class="flex gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                  <span
                    class="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-bold text-primary dark:bg-primary/20">
                    {{ index + 1 }}
                  </span>
                  <div class="flex min-w-0 flex-1 items-start gap-2">
                    <UIcon name="i-mdi-check-decagram" class="mt-0.5 size-5 shrink-0 text-primary" />
                    <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{{ rule }}</p>
                  </div>
                </li>
              </ul>
            </template>

            <template #acc-moderators>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="(m, i) in tour.tournament!.moderators" :key="i"
                  class="flex items-center gap-3 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-primary/[0.03] dark:border-gray-700/90 dark:bg-gray-900/55 dark:hover:border-primary/40">
                  <UAvatar :src="m.user.avatarUrl || undefined" :alt="m.user.username" size="lg"
                    class="ring-2 ring-gray-100 dark:ring-gray-800" />
                  <div class="min-w-0 flex-1 text-sm">
                    <p class="truncate font-semibold text-gray-900 dark:text-white">
                      {{ m.user.name || m.user.username }}
                    </p>
                    <div class="mt-1.5 flex flex-wrap gap-1">
                      <UBadge v-for="(perm, k) in m.permissions" :key="k" size="xs" variant="soft">{{ perm }}</UBadge>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </UAccordion>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
<script lang="ts" setup>
import {
  type DetailTournament,
  TournamentState,
  type TournamentDetailedState,
} from "~/features/tournament/models/tournament";
import type { TournamentType } from "~/features/tournament/models/tournamenetType";
import type { TournamentPrizeCurrency } from "~/features/tournament/models/tournamentPrize";
import { formatDate } from "~/utils/formatDate";
import { PHASE_LABELS_AR } from "~/features/tournament/core/composables/useTournamentDashboardPhase";

type TournamentGetHeroAccordionItem = { value: string; slot: string; label: string };
type TournamentGetDetailsAccordionItem = { label: string; slot: string; icon: string };

defineProps<{
  tour: DetailTournament;
  heroAccordionItems: TournamentGetHeroAccordionItem[];
  detailsAccordionItems: TournamentGetDetailsAccordionItem[];
  detailedState: TournamentDetailedState | undefined;
  getState: (v: TournamentState) => { label: string; color: string } | undefined;
  getType: (v: TournamentType) => { label: string; color?: string | null } | undefined;
  getCurrency: (v: TournamentPrizeCurrency) => { label: string } | undefined;
}>();

const heroAccordionOpen = defineModel<string | undefined>("heroAccordionOpen", { required: true });
const detailsSectionsOpen = defineModel<string[]>("detailsSectionsOpen", { required: true });

type BadgeColor = "neutral" | "success" | "warning" | "error" | "primary" | "secondary" | "info";

const BADGE_COLORS: readonly BadgeColor[] = [
  "neutral",
  "success",
  "warning",
  "error",
  "primary",
  "secondary",
  "info",
] as const;

function toBadgeColor(c: string | null | undefined, fallback: BadgeColor = "neutral"): BadgeColor {
  if (c && (BADGE_COLORS as readonly string[]).includes(c)) return c as BadgeColor;
  return fallback;
}
</script>
