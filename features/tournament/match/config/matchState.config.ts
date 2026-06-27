import type { MatchAction, MatchActionType } from "../types/matchAction.types";
import type { MatchLifecycleState } from "~/features/tournament/models/group";
import type { MatchStatusIcon } from "../types/matchViewModel.types";

export type MatchListBadgeColor = "neutral" | "success" | "warning" | "info" | "error";

export type MatchStateConfig = {
  statusIcon: MatchStatusIcon;
  statusBadgeText: string;
  statusBadgeClass: string;
  nodeStatusBadgeClass: string;
  matchStatusText: string;
  cardToneClass: string;
  listLabel: string;
  listBadgeColor: MatchListBadgeColor;
  canEdit: boolean;
  showInfoButton: boolean;
  allowResetWhenGroupRunning: boolean;
  allowBackWhenGroupRunning: boolean;
  actions: readonly MatchActionType[];
};

export const MATCH_ACTIONS: Record<MatchActionType, MatchAction> = {
  edit: {
    type: "edit",
    label: "تعديل المباراة",
    icon: "i-heroicons-cog-6-tooth",
  },
  reset: {
    type: "reset",
    label: "اعادة الضبط",
    icon: "i-heroicons-arrow-path",
  },
  back: {
    type: "back",
    label: "مسح اخر  مشتري",
    icon: "i-heroicons-arrow-left",
  },
  copy: {
    type: "copy",
    label: "نسخ معلومات المباراة",
    icon: "i-heroicons-clipboard-document",
  },
  copyStream: {
    type: "copyStream",
    label: "نسخ البث",
    icon: "i-heroicons-play-circle",
  },
};

export const MATCH_STATE_CONFIG: Record<MatchLifecycleState, MatchStateConfig> = {
  Created: {
    statusIcon: "sleep",
    statusBadgeText: "جاهزة",
    statusBadgeClass: "match-status-badge--created",
    nodeStatusBadgeClass: "match-node-status--created",
    matchStatusText: "المباراة جاهزة",
    cardToneClass: "match-card--created",
    listLabel: "تم الإنشاء",
    listBadgeColor: "neutral",
    canEdit: true,
    showInfoButton: false,
    allowResetWhenGroupRunning: false,
    allowBackWhenGroupRunning: false,
    actions: ["edit", "copy", "copyStream"],
  },
  Running: {
    statusIcon: "running",
    statusBadgeText: "جارية",
    statusBadgeClass: "match-status-badge--running",
    nodeStatusBadgeClass: "match-node-status--running",
    matchStatusText: "المباراة جارية",
    cardToneClass: "match-card--running",
    listLabel: "قيد التشغيل",
    listBadgeColor: "success",
    canEdit: false,
    showInfoButton: true,
    allowResetWhenGroupRunning: false,
    allowBackWhenGroupRunning: false,
    actions: ["copy", "copyStream"],
  },
  Paused: {
    statusIcon: "sleep",
    statusBadgeText: "متوقفة",
    statusBadgeClass: "match-status-badge--paused",
    nodeStatusBadgeClass: "match-node-status--paused",
    matchStatusText: "المباراة متوقفة",
    cardToneClass: "match-card--paused",
    listLabel: "متوقف",
    listBadgeColor: "warning",
    canEdit: true,
    showInfoButton: true,
    allowResetWhenGroupRunning: true,
    allowBackWhenGroupRunning: false,
    actions: ["edit", "reset", "copy", "copyStream"],
  },
  Ended: {
    statusIcon: "ended",
    statusBadgeText: "انتهت",
    statusBadgeClass: "match-status-badge--ended",
    nodeStatusBadgeClass: "match-node-status--ended",
    matchStatusText: "المباراة انتهت",
    cardToneClass: "match-card--ended",
    listLabel: "انتهت",
    listBadgeColor: "info",
    canEdit: false,
    showInfoButton: true,
    allowResetWhenGroupRunning: true,
    allowBackWhenGroupRunning: true,
    actions: ["reset", "back", "copy", "copyStream"],
  },
};
