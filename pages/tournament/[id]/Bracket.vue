<template>
  <div
    class="bracket-page flex min-h-screen flex-col"
    :class="{ 'bracket-page--obs': obsMode }"
    :tabindex="obsMode ? -1 : undefined"
  >
    <!-- OBS: invisible hit area — double-click top-left toggles theme (stream-safe) -->
    <button
      v-if="obsMode"
      type="button"
      class="bracket-obs-theme-hit"
      aria-label="تبديل الثيم (نقر مزدوج)"
      @dblclick.prevent="toggleTheme"
    />

    <div v-if="!obsMode" class="bracket-page__toolbar shrink-0">
      <BracketPageHeader
        v-if="userStore.user && (userStore.isStaffAdmin || userStore.isSuperAdmin)"
        @regenerate-final-matches="openFinalGroupRegenerateDrawer"
        @open-start-confirm="openStartTournamentConfirm"
        @edit-round="onEditRoundFromHeader"
        @finish-tournament="finishTournament"
        @resume-final-group-after-finish="resumeFinalGroupAfterFinish"
        @open-start-confirm-map="openStartTournamentConfirmMap"
      />
      <UButtonGroup
        v-else-if="tourStore.tournament.length > 0"
        orientation="horizontal"
        class="flex flex-wrap"
      >
        <UButton
          v-for="item in tourStore.tournament"
          :key="item.data.id"
          class="basis-[20px] grow"
          :label="`${item.data.name}`"
          block
          :color="tourStore.selectedGroup?.data.id == item.data.id ? 'success' : 'neutral'"
          @click="handleGroupSelection(item.data.id.toString())"
        />
      </UButtonGroup>

      <loading
        v-if="tourStore.groupsREQ?.status && tourStore.groupsREQ?.status == 'pending'"
      />
    </div>

    <ClientOnly class="bracket-page__content flex min-h-0 flex-1 flex-col">
      <div v-if="!obsMode" class="bracket-logo-theme">
        <img
          :src="QydhaLogo"
          alt="Qydha logo"
          loading="lazy"
          decoding="async"
          class="bracket-logo"
        >
        <button
          class="theme-toggle-btn mt-2 rounded border px-3 py-1 text-xs font-semibold"
          :class="isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-300'"
          aria-label="تبديل الثيم"
          @click="toggleTheme"
        >
          <template v-if="isDark">☀️</template>
          <template v-else>🌙</template>
        </button>
      </div>

      <div
        v-if="canShowBracket"
        class="bracket-page__bracket-wrap relative min-h-0 w-full flex-1"
      >
        <Bracket :group="tourStore.selectedGroup!.data" />
      </div>
      <div v-else-if="!obsMode" class="flex flex-1 flex-col items-center justify-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-warning-500" />
        <h1 class="text-2xl font-bold">لا يمكن عرض الخريطة حاليا</h1>
        <p class="text-gray-500">يجب عليك ان تنتظر ان يبدأ المباريات</p>
      </div>
    </ClientOnly>

    <template v-if="!obsMode">
      <UpdateRoundDrawer
        v-if="userStore.user && (userStore.isStaffAdmin || userStore.isSuperAdmin)"
        ref="updateRoundDrawer"
        :round="roundBeingEdited"
        :tour-id="tourid"
        :group-id="tourStore.selectedGroup?.data.id || ''"
      />

      <CreateMatchDrawer
        v-if="userStore.user && (userStore.isStaffAdmin || userStore.isSuperAdmin) && tourStore.selectedGroup"
        :key="tourStore.selectedGroup.data.id"
        ref="createMatchDrawer"
        :group="tourStore.selectedGroup.data"
        drawer-title="إعادة إنشاء مباريات النهائي"
        drawer-subtitle="اضبط الطاولات والمدة والإعدادات ثم احفظ — المجموعة:"
        @success="onCreateMatchDrawerSuccess"
      />

      <TournamentGetStartConfirmModal
        v-model:open="startTournamentConfirmOpen"
        :pending="isStartFinalGroupPending"
        @confirm="confirmAndStartTournament"
      />

      <TournamentGetApprovePlanConfirmModal
        v-model:open="startTournamentConfirmMapOpen"
        :pending="isStartFinalGroupPending"
        @confirm="confirmAndStartTournamentMap"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { GroupType, type RoundGroupDetails } from '~/features/tournament/models/group';
import { useMyTournamentStore } from '~/features/tournament/core/stores/tournament';
import { Bracket, BracketPageHeader } from '~/features/tournament/bracket/components';
import UpdateRoundDrawer from '~/features/tournament/group/components/Round/UpdateRoundDrawer.vue';
import CreateMatchDrawer from '~/features/tournament/group/components/CreateMatchDrawer.vue';
import TournamentGetStartConfirmModal from '~/features/tournament/core/components/TournamentGet/TournamentGetStartConfirmModal.vue';
import { GroupState } from '~/features/tournament/models/group';
import QydhaLogo from '@/assets/images/qydha-logo.svg';
import TournamentGetApprovePlanConfirmModal from '~/features/tournament/core/components/TournamentGet/TournamentGetApprovePlanConfirmModal.vue';
import { useMyAuthStore } from '~/store/Auth';
import { useEventListener } from '@vueuse/core';

definePageMeta({
  layout: 'custom',
});

useHead({
  title: 'خريطة البطولة',
  meta: [{ name: 'description', content: 'خريطة البطولة' }],
});

/** Query: ?obsMode=true | ?obsMode=false | ?obsMode=1 | ?obsMode=yes */
const OBS_MODE_QUERY = 'obsMode';
/** Query: ?theme=dark | ?theme=light (works in OBS without keyboard) */
const THEME_QUERY = 'theme';
const BRACKET_OBS_THEME_KEY = 'bracket-overlay-theme';

type BracketTheme = 'dark' | 'light';

function parseObsModeQuery(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  if (Array.isArray(value)) return parseObsModeQuery(value[0]);
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  }
  return false;
}

function parseThemeQuery(value: unknown): BracketTheme | null {
  if (Array.isArray(value)) return parseThemeQuery(value[0]);
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'dark' || normalized === 'light') return normalized;
  return null;
}

const route = useRoute();
const router = useRouter();
const tourid = route.params.id?.toString() || '';

/** `true` when ?obsMode=true (OBS overlay). `false` otherwise (normal page). */
const obsMode = computed<boolean>(() => parseObsModeQuery(route.query[OBS_MODE_QUERY]));

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');

function applyTheme(theme: BracketTheme) {
  if (colorMode?.forced) return;
  colorMode.preference = theme;
}

function persistObsTheme(theme: BracketTheme) {
  if (!import.meta.client || !obsMode.value) return;
  localStorage.setItem(BRACKET_OBS_THEME_KEY, theme);
}

function toggleTheme() {
  if (colorMode?.forced) return;
  const next: BracketTheme = colorMode.value === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  if (obsMode.value) {
    persistObsTheme(next);
    void router.replace({ query: { ...route.query, [THEME_QUERY]: next } });
  }
}

function handleThemeShortcut(e: KeyboardEvent) {
  const target = e.target;
  if (target instanceof HTMLElement) {
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return;
  }

  const ctrlOrCmdM =
    e.code === 'KeyM' && (e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey;
  /** Alt+M and [ ] — reliable in OBS after "Interact" on the browser source */
  const obsAltM =
    obsMode.value && e.code === 'KeyM' && e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
  const obsBracketKey =
    obsMode.value
    && (e.code === 'BracketRight' || e.code === 'BracketLeft')
    && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey;

  if (!ctrlOrCmdM && !obsAltM && !obsBracketKey) return;

  e.preventDefault();
  e.stopPropagation();
  toggleTheme();
}

useEventListener(window, 'keydown', handleThemeShortcut, { capture: true });

watch(
  () => route.query[THEME_QUERY],
  (raw) => {
    const theme = parseThemeQuery(raw);
    if (theme) applyTheme(theme);
  },
  { immediate: true },
);

useEventListener(window, 'storage', (e: StorageEvent) => {
  if (!obsMode.value || e.key !== BRACKET_OBS_THEME_KEY) return;
  if (e.newValue === 'dark' || e.newValue === 'light') applyTheme(e.newValue);
});

const userStore = useMyAuthStore();
const tourStore = useMyTournamentStore();

const showBracketByState = computed(
  () =>
    tourStore.selectedGroup?.data.state != GroupState.WaitingMatchesStarting
    || userStore.isStaffAdmin
    || userStore.isSuperAdmin,
);

const canShowBracket = computed(() => {
  if (!tourStore.selectedGroup) return false;
  if (obsMode.value) return true;
  return showBracketByState.value;
});

const toast = useToast();
const createMatchDrawer = useTemplateRef<InstanceType<typeof CreateMatchDrawer>>('createMatchDrawer');
const startFinalGroupTournamentReq = await useTournament().startFinalGroupTournament(tourid);
const startTournamentConfirmOpen = ref(false);

const isStartFinalGroupPending = computed(
  () => startFinalGroupTournamentReq.result.status.value === 'pending',
);

const handleGroupSelection = (group_id: string) => {
  useRouter().push({
    path: useRoute().path,
    query: { ...route.query, group: group_id },
  });
};

const openStartTournamentConfirm = () => {
  if (tourStore.selectedGroup?.data.type !== GroupType.Final) return;
  startTournamentConfirmOpen.value = true;
};

const confirmAndStartTournament = async () => {
  await startFinalGroupTournamentReq.fetchREQ();
  if (startFinalGroupTournamentReq.result.status.value === 'success') {
    toast.add({
      title: 'تم بدء المباريات في المجموعة النهائية',
      description: 'تم بدء المباريات في المجموعة النهائية بنجاح',
      color: 'success',
    });
    startTournamentConfirmOpen.value = false;
    await tourStore.refreshBracket(tourid);
  } else {
    const err = startFinalGroupTournamentReq.result.error.value as
      | { message?: string }
      | null
      | undefined;
    toast.add({
      title: 'تعذّر بدء البطولة',
      description: err?.message ?? 'تحقق من الاتصال وحاول مرة أخرى.',
      color: 'error',
    });
  }
};
onMounted(async () => {
  if (obsMode.value && import.meta.client) {
    if (!parseThemeQuery(route.query[THEME_QUERY])) {
      const stored = localStorage.getItem(BRACKET_OBS_THEME_KEY);
      if (stored === 'dark' || stored === 'light') applyTheme(stored);
    }
    await nextTick();
    document.querySelector<HTMLElement>('.bracket-obs-theme-hit')?.focus({ preventScroll: true });
  }
  await tourStore.initStore();
});

const openFinalGroupRegenerateDrawer = () => {
  if (tourStore.selectedGroup?.data.type !== GroupType.Final) return;
  const d = createMatchDrawer.value;
  if (d) d.open = true;
};

const onCreateMatchDrawerSuccess = async () => {
  await tourStore.refreshBracket(tourid);
};

const finishReq = await useTournament().finishTournament();
const finishTournament = async () => {
  await finishReq.fetchREQ(tourid);
  if (finishReq.status.value == 'success') {
    toast.add({
      title: 'تم انهاء البطولة',
      description: 'تم انهاء البطولة بنجاح',
      color: 'success',
    });
    await tourStore.refreshBracket(tourid);
  } else {
    toast.add({
      title: 'تعذّر انهاء البطولة',
      description: 'لا يمكن انهاء البطولة الا بعد انهاء كل المباريات  ',
      color: 'error',
    });
  }
};

const resumeReq = await useTournament().resumeFinalGroupAfterFinish();
const resumeFinalGroupAfterFinish = async () => {
  await resumeReq.fetchREQ(tourid);
  if (resumeReq.status.value == 'success') {
    toast.add({
      title: 'تم استكمال البطولة',
      description: 'تم استكمال البطولة بنجاح',
      color: 'success',
    });
    await tourStore.refreshBracket(tourid);
  } else {
    const err = resumeReq.error.value as { message?: string } | null | undefined;
    toast.add({
      title: 'تعذّر استكمال البطولة',
      description: err?.message ?? 'تحقق من الاتصال وحاول مرة أخرى.',
      color: 'error',
    });
  }
};

const startTournamentConfirmMapOpen = ref(false);

const openStartTournamentConfirmMap = () => {
  if (tourStore.selectedGroup?.data.type !== GroupType.Final) return;
  startTournamentConfirmMapOpen.value = true;
};

const approveReq = await useTournament().approveTournamentPlan();
const confirmAndStartTournamentMap = async () => {
  await approveReq.fetchREQ(tourid);
  if (approveReq.status.value === 'success') {
    toast.add({
      title: 'تمت الموافقة على مخطط البطولة',
      color: 'success',
    });
    startTournamentConfirmMapOpen.value = false;
    await tourStore.refreshBracket(tourid);
  } else {
    toast.add({
      title: 'تعذّرت الموافقة على المخطط',
      color: 'error',
    });
  }
};

const roundBeingEdited = ref<RoundGroupDetails['rounds'][0] | null>(null);
const updateRoundDrawer = useTemplateRef('updateRoundDrawer');

const onEditRoundFromHeader = (round: RoundGroupDetails['rounds'][0]) => {
  roundBeingEdited.value = round;
  if (updateRoundDrawer.value) {
    updateRoundDrawer.value.open = true;
  }
};

function applyObsDocumentClass(active: boolean) {
  if (!import.meta.client) return;
  document.documentElement.classList.toggle('bracket-obs', active);
}

watch(obsMode, (active) => applyObsDocumentClass(active), { immediate: true });

onUnmounted(() => {
  applyObsDocumentClass(false);
  tourStore.closeConnection();
});
</script>

<style scoped>
.bracket-page__bracket-wrap :deep(.bracket-container),
.bracket-page__bracket-wrap :deep(.bracket-flow) {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 11rem);
}

.bracket-page--obs {
  background: transparent;
}

.bracket-page--obs .bracket-page__bracket-wrap :deep(.bracket-container),
.bracket-page--obs .bracket-page__bracket-wrap :deep(.bracket-flow) {
  min-height: 100vh;
  height: 100vh;
}

/* OBS overlay: fully invisible control — not visible on stream */
.bracket-obs-theme-hit {
  position: fixed;
  top: 0;
  inset-inline-start: 0;
  z-index: 9999;
  width: 48px;
  height: 48px;
  margin: 0;
  padding: 0;
  border: none;
  opacity: 0;
  background: transparent;
  cursor: default;
  pointer-events: auto;
}
</style>

<style>
html.bracket-obs,
html.bracket-obs body,
html.bracket-obs #__nuxt,
html.bracket-obs #__nuxt > div,
html.bracket-obs main {
  background: transparent !important;
  background-color: transparent !important;
}
</style>

