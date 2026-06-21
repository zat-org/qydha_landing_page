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
import { SETTINGS_MENU_TAB_VIEWS } from '~/features/tournament/detail/constants/tournamentNavigation.config';
import {
  buildTabNavItems,
  navigateToTabView,
} from '~/features/tournament/detail/utils/tournamentNavigation.utils';
import type { DetailTournament } from '~/features/tournament/models/tournament';

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
    ...buildTabNavItems(SETTINGS_MENU_TAB_VIEWS, props.id).map((item) => ({
      label: item.label,
      icon: item.icon,
      onSelect: () => navigateToTabView(item.view, props.id),
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
