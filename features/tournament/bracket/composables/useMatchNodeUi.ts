import type { Ref } from "vue";
import type { Match } from "~/features/tournament/models/group";

type MatchStateTone = "created" | "running" | "paused" | "ended";

function getTone(match: Match): MatchStateTone {
  if (match.state === "Running") return "running";
  if (match.state === "Paused") return "paused";
  if (match.state === "Ended") return "ended";
  return "created";
}

export function useMatchNodeUi(
  match: Ref<Match>,
  selectedRoundName: Ref<string | undefined>,
  privilege: Ref<string | undefined>,
) {
  const tone = computed(() => getTone(match.value));

  const hasStaffOrAdminPrivileges = computed(() => {
    const p = privilege.value?.toLowerCase();
    return p === "admin" || p === "owner" || p === "staff";
  });

  const isMatchCreatedOrPaused = computed(
    () => match.value.state === "Created" || match.value.state === "Paused",
  );
  const isMatchRunning = computed(() => match.value.state === "Running");
  const isMatchEnded = computed(() => match.value.state === "Ended");
  const showInfoButton = computed(
    () => match.value.qydhaGameId && match.value.state !== "Created",
  );

  const cardToneClass = computed(() => {
    if (tone.value === "running") {
      return "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-emerald-950 dark:from-lime-900/35 dark:via-emerald-900/25 dark:to-cyan-900/35 dark:text-emerald-100";
    }
    if (tone.value === "paused") {
      return "bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50 text-indigo-950 dark:from-violet-900/35 dark:via-fuchsia-900/25 dark:to-purple-900/35 dark:text-violet-100";
    }
    if (tone.value === "ended") {
      return "bg-gradient-to-br from-slate-50 via-zinc-50 to-stone-50 text-slate-900 dark:from-stone-900/50 dark:via-zinc-900/45 dark:to-slate-900/55 dark:text-stone-100";
    }
    return "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-orange-950 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-orange-950/30 dark:text-amber-100";
  });

  const roundOpacityClass = computed(() =>
    selectedRoundName.value &&
    selectedRoundName.value !== match.value.roundName
      ? "opacity-50"
      : "",
  );

  const firstTeamClasses = computed(() => {
    if (match.value.winner?.toLowerCase() === "us") {
      return "bg-gradient-to-r from-emerald-200/95 to-green-100/95 text-emerald-950 dark:from-emerald-700/90 dark:to-green-700/90 dark:text-emerald-50";
    }
    if (match.value.state === "Ended") {
      return "bg-gradient-to-r from-rose-200/95 to-red-100/95 text-rose-900 dark:from-rose-900/65 dark:to-red-900/65 dark:text-rose-100";
    }
    return "bg-white/75 text-slate-900 dark:bg-slate-800/75 dark:text-slate-100";
  });

  const secondTeamClasses = computed(() => {
    if (match.value.winner?.toLowerCase() === "them") {
      return "bg-gradient-to-r from-emerald-200/95 to-green-100/95 text-emerald-950 dark:from-emerald-700/90 dark:to-green-700/90 dark:text-emerald-50";
    }
    if (match.value.state === "Ended") {
      return "bg-gradient-to-r from-rose-200/95 to-red-100/95 text-rose-900 dark:from-rose-900/65 dark:to-red-900/65 dark:text-rose-100";
    }
    return "bg-white/75 text-slate-900 dark:bg-slate-800/75 dark:text-slate-100";
  });

  const firstTeamNameClasses = computed(() => ({
    "line-through opacity-60":
      match.value.state === "Ended" &&
      !match.value.qydhaGameId &&
      (match.value.winner?.toLowerCase() === "them" || !match.value.winner),
  }));

  const secondTeamNameClasses = computed(() => ({
    "line-through opacity-60":
      match.value.state === "Ended" &&
      !match.value.qydhaGameId &&
      (match.value.winner?.toLowerCase() === "us" || !match.value.winner),
  }));

  const statusBadgeText = computed(() => {
    if (match.value.state === "Running") return "جارية";
    if (match.value.state === "Paused") return "متوقفة";
    if (match.value.state === "Ended") return "انتهت";
    return "جاهزة";
  });

  const statusBadgeClass = computed(() => {
    if (tone.value === "running") return "bg-emerald-600 text-white dark:bg-emerald-500";
    if (tone.value === "paused") return "bg-violet-600 text-white dark:bg-violet-500";
    if (tone.value === "ended") return "bg-stone-700 text-white dark:bg-stone-600";
    return "bg-orange-600 text-white dark:bg-orange-500";
  });

  const matchStatusText = computed(() => {
    if (match.value.state === "Running") return "المباراة جارية";
    if (match.value.state === "Paused") return "المباراة متوقفة";
    if (match.value.state === "Created") return "المباراة جاهزة";
    if (match.value.state === "Ended") return "المباراة انتهت";
    return "";
  });

  const matchInfoTooltip = computed(() => {
    const parts = [];
    if (match.value.tableName) parts.push(`الطاولة: ${match.value.tableName}`);
    if (match.value.roundName) parts.push(`الجولة: ${match.value.roundName}`);
    if (match.value.startAt) parts.push(`الوقت: ${formatDateTime(match.value.startAt)}`);
    return parts.length > 0 ? parts.join(" | ") : "";
  });

  return {
    hasStaffOrAdminPrivileges,
    isMatchCreatedOrPaused,
    isMatchRunning,
    isMatchEnded,
    showInfoButton,
    cardToneClass,
    roundOpacityClass,
    firstTeamClasses,
    secondTeamClasses,
    firstTeamNameClasses,
    secondTeamNameClasses,
    statusBadgeText,
    statusBadgeClass,
    matchStatusText,
    matchInfoTooltip,
  };
}
