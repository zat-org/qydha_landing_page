<template>
  <div class="flex flex-col gap-3 px-4 py-3.5 sm:px-8 sm:py-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <UButton
        label="عودة"
        color="neutral"
        variant="soft"
        size="sm"
        icon="i-mdi-arrow-right"
        to="/tournament"
      />
      <div class="flex flex-wrap items-center justify-end gap-2">
        <UDropdownMenu
          :items="settingsMenuItems"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            label="الإعدادات"
            icon="i-heroicons-cog-6-tooth"
            color="neutral"
            variant="soft"
            size="sm"
            trailing-icon="i-heroicons-chevron-down"
          />
        </UDropdownMenu>
      </div>
    </div>

    <TournamentJoinRequestSettingsDrawer
      ref="joinSettingsDrawer"
      :tournament-id="id"
      :tournament="tournament"
      @success="emit('refreshed')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui';
import TournamentJoinRequestSettingsDrawer from './TournamentJoinRequestSettingsDrawer.vue';
import { TAB_VIEW_CONFIG } from '~/features/tournament/detail/constants/tournamentNavigation.config';
import {
  getPhaseViewPath,
  openTournamentViewInNewTab,
} from '~/features/tournament/detail/utils/tournamentNavigation.utils';
import type { TournamentTabView } from '~/features/tournament/detail/types/navigation.types';
import type { DetailTournament } from '~/features/tournament/models/tournament';

const HEADER_TAB_VIEWS: {
  view: TournamentTabView;
  openInNewTab: boolean;
}[] = [
  { view: 'tables', openInNewTab: false },
  { view: 'refree', openInNewTab: false },
  { view: 'bracket', openInNewTab: true },
  { view: 'statistics', openInNewTab: true },
];

const props = defineProps<{
  id: string;
  isAdmin: boolean;
  tournament: DetailTournament['tournament'];
}>();

const emit = defineEmits<{
  refreshed: [];
}>();

const toast = useToast();
const showInQydhaReq = useUpdateShowInQydha();

const showInQydha = ref(false);

watch(
  () => props.tournament?.showInQydha,
  (value) => {
    if (value !== undefined) showInQydha.value = !!value;
  },
  { immediate: true },
);

const showInQydhaPending = computed(() => showInQydhaReq.pending.value);

const joinSettingsDrawer = useTemplateRef<InstanceType<typeof TournamentJoinRequestSettingsDrawer>>(
  'joinSettingsDrawer',
);

function openJoinSettingsDrawer() {
  if (joinSettingsDrawer.value) joinSettingsDrawer.value.open = true;
}

function navigateToTabView(view: TournamentTabView) {
  const item = HEADER_TAB_VIEWS.find((entry) => entry.view === view);
  if (item?.openInNewTab) {
    openTournamentViewInNewTab(view, props.id);
    return;
  }
  void navigateTo(getPhaseViewPath(view, props.id));
}

const settingsMenuItems = computed(() => {
  const visibilityItem = {
    label: 'عرض البطولة في قيدها',
    type: 'checkbox' as const,
    icon: 'i-heroicons-globe-alt',
    checked: showInQydha.value,
    disabled: showInQydhaPending.value,
    onUpdateChecked: (checked: boolean) => {
      void onShowInQydhaChange(checked);
    },
  } satisfies DropdownMenuItem;

  const items: DropdownMenuItem[] = [];

  if (props.tournament.addPlayersByQydha) {
    items.push({
      label: 'إعدادات طلبات الانضمام',
      icon: 'i-mdi-calendar-edit',
      onSelect: openJoinSettingsDrawer,
    });
  }

  if (props.isAdmin) {
    items.push({
      label: 'تعديل',
      icon: 'i-mdi-pencil',
      onSelect: () => { void navigateTo(`/tournament/${props.id}/edit`); },
    });
  }

  items.push(
    ...HEADER_TAB_VIEWS.map(({ view }) => ({
      label: TAB_VIEW_CONFIG[view].label,
      icon: TAB_VIEW_CONFIG[view].icon,
      onSelect: () => navigateToTabView(view),
    })),
  );

  return [[visibilityItem], items];
});

async function onShowInQydhaChange(value: boolean) {
  const previous = showInQydha.value;
  showInQydha.value = value;

  await showInQydhaReq.fetchREQ(props.id, value);

  if (showInQydhaReq.status.value === 'success') {
    toast.add({
      title: value ? 'تم تفعيل الظهور في قيدها' : 'تم إخفاء البطولة من قيدها',
      color: 'success',
    });
    emit('refreshed');
    return;
  }

  showInQydha.value = previous;
  toast.add({
    title: 'تعذّر تحديث إعداد الظهور',
    color: 'error',
  });
}
</script>
