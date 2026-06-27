import type { Ref } from "vue";
import type { Match } from "~/features/tournament/models/group";
import { useMatchViewModel } from "~/features/tournament/match/composables/useMatchViewModel";

/**
 * @deprecated Prefer `useMatchViewModel` from `~/features/tournament/match/composables/useMatchViewModel`.
 */
export function useMatchNodeUi(
  match: Ref<Match>,
  selectedRoundName: Ref<string | undefined>,
  _privilege: Ref<string | undefined>,
) {
  const { vm, hasStaffOrAdminPrivileges } = useMatchViewModel(match);

  const roundOpacityFromSelectedRound = computed(() =>
    selectedRoundName.value && selectedRoundName.value !== match.value.roundName
      ? "opacity-50"
      : "",
  );

  return {
    hasStaffOrAdminPrivileges,
    isMatchCreatedOrPaused: computed(
      () => vm.value.state === "Created" || vm.value.state === "Paused",
    ),
    isMatchRunning: computed(() => vm.value.state === "Running"),
    isMatchEnded: computed(() => vm.value.state === "Ended"),
    isMatchPaused: computed(() => vm.value.state === "Paused"),
    isMatchCreated: computed(() => vm.value.state === "Created"),
    showInfoButton: computed(() => vm.value.showInfoButton),
    cardToneClass: computed(() => vm.value.cardToneClass),
    roundOpacityClass: roundOpacityFromSelectedRound,
    firstTeamClasses: computed(() => vm.value.firstTeamClasses),
    secondTeamClasses: computed(() => vm.value.secondTeamClasses),
    firstTeamNameClasses: computed(() => vm.value.firstTeamNameClasses),
    secondTeamNameClasses: computed(() => vm.value.secondTeamNameClasses),
    statusBadgeText: computed(() => vm.value.statusBadgeText),
    statusBadgeClass: computed(() => vm.value.statusBadgeClass),
    matchStatusText: computed(() => vm.value.matchStatusText),
    matchInfoTooltip: computed(() => vm.value.matchInfoTooltip),
  };
}
