import { useMatch } from "~/features/tournament/core/composables/match";
import type { IMatchUpdate, IUpdateChoicesForMatch } from "~/features/tournament/models/match";
import type { Match } from "~/features/tournament/models/group";

export const useMatchEditChoices = async (tour_id: string, match_id: string, match: Match) => {
  const { getUpdateChoicesForMatch } = useMatch();
  const choicesREQ = await getUpdateChoicesForMatch(tour_id, match_id);

  const state = reactive<IMatchUpdate>({
    refereeId: undefined,
    tableId: undefined,
    isMarked: false,
  });

  if (choicesREQ.status.value === "success" && choicesREQ.data?.value?.data) {
    state.refereeId = choicesREQ.data.value.data.selectedReferee?.id || undefined;
    state.tableId = choicesREQ.data.value.data.selectedTable?.id || undefined;
    state.isMarked = match.isMarked || false;
  }

  const matchChoices = computed<IUpdateChoicesForMatch | null>(() => {
    if (choicesREQ.status.value === "success" && choicesREQ.data?.value?.data) {
      return choicesREQ.data.value.data || null;
    }
    return null;
  });

  const refereeItems = computed(() => {
    if (!matchChoices.value) return [];
    const available = matchChoices.value.availableReferee || [];
    const selected = matchChoices.value.selectedReferee;
    if (selected) return [selected, ...available];
    return available;
  });

  const tableItems = computed(() => {
    if (!matchChoices.value) return [];
    const available = matchChoices.value.availableTable || [];
    const selected = matchChoices.value.selectedTable;
    if (selected) return [selected, ...available];
    return available;
  });

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

  return { state, matchChoices, refereeItems, tableItems, selectedRefereeDisplay, selectedTableDisplay, choicesREQ };
};
