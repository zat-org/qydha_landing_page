import type { Ref } from "vue";
import type { Match } from "~/features/tournament/models/group";
import { useMatchViewModel } from "~/features/tournament/match/composables/useMatchViewModel";
import { normalizeMatchState } from "~/features/tournament/match/utils/matchState.utils";

function buildTeamDisplay(
  match: Match,
  teamName?: string | null,
  hasTeamId?: string | null,
) {
  const normalizedName = (teamName || "").trim();
  const state = normalizeMatchState(match.state);

  if (normalizedName) {
    const [primary, secondary] = normalizedName
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);
    return {
      primary: primary || normalizedName,
      secondary: secondary || " ",
    };
  }

  if (!hasTeamId && state !== "Ended") {
    return { primary: "لم يحدد بعد", secondary: " " };
  }

  return { primary: "انسحب كلا الفريقين", secondary: "" };
}

export function useMatchNodeShared(match: Ref<Match>) {
  const { vm, roundOpacityClass, hasStaffOrAdminPrivileges } = useMatchViewModel(match);

  const usTeamDisplay = computed(() =>
    buildTeamDisplay(match.value, match.value.usTeamName, match.value.usTeamId),
  );
  const themTeamDisplay = computed(() =>
    buildTeamDisplay(match.value, match.value.themTeamName, match.value.themTeamId),
  );

  const usTeamPrimary = computed(() => usTeamDisplay.value.primary);
  const usTeamSecondary = computed(() => usTeamDisplay.value.secondary);
  const themTeamPrimary = computed(() => themTeamDisplay.value.primary);
  const themTeamSecondary = computed(() => themTeamDisplay.value.secondary);

  const firstTeamSurfaceClass = computed(() => {
    const viewModel = vm.value;
    if (viewModel.isFinalPlacement) {
      return match.value.winner?.toLowerCase() === "us"
        ? "match-final--first"
        : "match-final--second";
    }
    return viewModel.firstTeamClasses;
  });

  const secondTeamSurfaceClass = computed(() => {
    const viewModel = vm.value;
    if (viewModel.isFinalPlacement) {
      return match.value.winner?.toLowerCase() === "them"
        ? "match-final--first"
        : "match-final--second";
    }
    return viewModel.secondTeamClasses;
  });

  return {
    vm,
    roundOpacityClass,
    hasStaffOrAdminPrivileges,
    usTeamPrimary,
    usTeamSecondary,
    themTeamPrimary,
    themTeamSecondary,
    firstTeamSurfaceClass,
    secondTeamSurfaceClass,
  };
}
