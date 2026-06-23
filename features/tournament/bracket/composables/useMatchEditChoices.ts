import { useMatch } from '~/features/tournament/shared/composables/match';
import type { IMatchUpdate, IUpdateChoicesForMatch } from "~/features/tournament/models/match";
import type { Match } from "~/features/tournament/models/group";

export function useMatchEditChoices(
  tour_id: string,
  match_id: string,
  match: Match,
) {
  const { getUpdateChoicesForMatch } = useMatch();
  const choicesREQ = getUpdateChoicesForMatch(tour_id, match_id);

  const state = reactive<IMatchUpdate>({
    refereeId: undefined,
    tableId: undefined,
    isMarked: false,
  });

  const syncStateFromChoices = (choices: IUpdateChoicesForMatch) => {
    state.refereeId = choices.selectedReferee?.id || undefined;
    state.tableId = choices.selectedTable?.id || undefined;
    state.isMarked = match.isMarked || false;
  };

  watch(
    () => choicesREQ.data.value?.data,
    (choices) => {
      if (choices) syncStateFromChoices(choices);
    },
    { immediate: true },
  );

  const matchChoices = computed<IUpdateChoicesForMatch | null>(() => {
    if (choicesREQ.status.value === "success" && choicesREQ.data?.value?.data) {
      return choicesREQ.data.value.data || null;
    }
    return null;
  });

  const dedupeById = <T extends { id: string }>(items: T[]) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  const refereeItems = computed(() => {
    if (!matchChoices.value) return [];
    const available = matchChoices.value.availableReferee || [];
    const selected = matchChoices.value.selectedReferee;
    if (selected) return dedupeById([selected, ...available]);
    return available;
  });

  const tableItems = computed(() => {
    if (!matchChoices.value) return [];
    const available = matchChoices.value.availableTable || [];
    const selected = matchChoices.value.selectedTable;
    if (selected) return dedupeById([selected, ...available]);
    return available;
  });

  const hasSingleTableChoice = computed(() => tableItems.value.length === 1);
  const singleTable = computed(() =>
    hasSingleTableChoice.value ? tableItems.value[0] : null,
  );

  watch(
    singleTable,
    (table) => {
      if (table) state.tableId = table.id;
    },
    { immediate: true },
  );

  const selectedRefereeDisplay = computed(() => {
    if (!matchChoices.value || !state.refereeId) return null;
    const selected = matchChoices.value.selectedReferee;
    if (selected && selected.id === state.refereeId) {
      return selected.username || selected.name || selected.id;
    }
    const found = refereeItems.value.find((r) => r.id === state.refereeId);
    return found?.username || found?.name || state.refereeId;
  });

  const selectedTableDisplay = computed(() => {
    if (!matchChoices.value || !state.tableId) return null;
    const selected = matchChoices.value.selectedTable;
    if (selected && selected.id === state.tableId) {
      return selected.name;
    }
    const found = tableItems.value.find((t) => t.id === state.tableId);
    return found?.name || state.tableId;
  });

  return {
    state,
    matchChoices,
    refereeItems,
    tableItems,
    hasSingleTableChoice,
    singleTable,
    selectedRefereeDisplay,
    selectedTableDisplay,
    choicesREQ,
  };
};
