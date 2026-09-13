import type { Ref } from "vue";
import type { Match } from "~/features/tournament/models/group";
import { useMatchViewModel } from "~/features/tournament/match/composables/useMatchViewModel";
import { normalizeMatchState } from "~/features/tournament/match/utils/matchState.utils";
import { useTournamentBracketStore } from "~/features/tournament/bracket/stores";

const SCORE_VISIBLE_STATES = new Set(["Running", "Paused", "Ended"]);

function buildTeamDisplay(
  match: Match,
  teamName?: string | null,
  hasTeamId?: string | null,
  qualifyFromMatchId?: string | null,
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

  if (!qualifyFromMatchId) {
    return { primary: "فريق منسحب", secondary: "" };
  }

  if (!hasTeamId && state !== "Ended") {
    return { primary: "لم يحدد بعد", secondary: " " };
  }

  return { primary: "انسحب كلا الفريقين", secondary: "" };
}

export function useMatchNodeShared(match: Ref<Match>) {
  const gameStore = useTournamentBracketStore();
  const { vm, roundOpacityClass, requesterMatchClass, hasStaffOrAdminPrivileges } =
    useMatchViewModel(match);

  const usTeamDisplay = computed(() =>
    buildTeamDisplay(
      match.value,
      match.value.usTeamName,
      match.value.usTeamId,
      match.value.matchQualifyUsTeamId,
    ),
  );
  const themTeamDisplay = computed(() =>
    buildTeamDisplay(
      match.value,
      match.value.themTeamName,
      match.value.themTeamId,
      match.value.matchQualifyThemTeamId,
    ),
  );

  const usTeamPrimary = computed(() => usTeamDisplay.value.primary);
  const usTeamSecondary = computed(() => usTeamDisplay.value.secondary);
  const themTeamPrimary = computed(() => themTeamDisplay.value.primary);
  const themTeamSecondary = computed(() => themTeamDisplay.value.secondary);

  const liveGame = computed(() => {
    const gameId = match.value.qydhaGameId;
    if (!gameId) return undefined;
    return gameStore.games.find((g) => g.id === gameId);
  });

  const lastSakka = computed(() => {
    const sakkas = liveGame.value?.game.sakkas ?? [];
    if (!sakkas.length) return null;
    return sakkas[sakkas.length - 1] ?? null;
  });

  const usScore = computed(() => liveGame.value?.game.usGameScore ?? null);
  const themScore = computed(() => liveGame.value?.game.themGameScore ?? null);

  /** Points total inside the latest sakka (sum of moshtaras). */
  const usMoshtaraScore = computed(() => lastSakka.value?.usSakkaScore ?? null);
  const themMoshtaraScore = computed(() => lastSakka.value?.themSakkaScore ?? null);

  const showScore = computed(() => {
    if (!match.value.qydhaGameId) return false;
    if (!SCORE_VISIBLE_STATES.has(normalizeMatchState(match.value.state))) {
      return false;
    }
    return liveGame.value != null;
  });

  const showMoshtaraScore = computed(() => showScore.value && lastSakka.value != null);

  watch(
    () =>
      [
        match.value.qydhaGameId,
        normalizeMatchState(match.value.state),
      ] as const,
    async ([gameId, state]) => {
      if (!gameId || !SCORE_VISIBLE_STATES.has(state)) return;
      if (gameStore.games.some((g) => g.id === gameId)) return;
      await gameStore.fetchGame(gameId);
    },
    { immediate: true },
  );

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
    requesterMatchClass,
    hasStaffOrAdminPrivileges,
    usTeamPrimary,
    usTeamSecondary,
    themTeamPrimary,
    themTeamSecondary,
    firstTeamSurfaceClass,
    secondTeamSurfaceClass,
    showScore,
    showMoshtaraScore,
    usScore,
    themScore,
    usMoshtaraScore,
    themMoshtaraScore,
  };
}
