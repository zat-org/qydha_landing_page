export const TOURNAMENT_GROUP_SCREEN_PATH = "/tournaments/{TournamentId}";

export const GROUP_NOTIFICATION_ACTION_KIND = {
  NoAction: "NoAction",
  GoToURL: "GoToURL",
  GoToScreen: "GoToScreen",
  GoToTab: "GoToTab",
} as const;

export type GroupNotificationActionKind =
  (typeof GROUP_NOTIFICATION_ACTION_KIND)[keyof typeof GROUP_NOTIFICATION_ACTION_KIND];

export type GroupNotificationActionType =
  | GroupNotificationActionKind
  | "PopUpWithNoAction"
  | "PopUpWithGoToURL"
  | "PopUpWithGoToScreen"
  | "PopUpWithGoToTab";

export const GROUP_NOTIFICATION_PLACEHOLDERS = [
  { key: "PlayerName", label: "اسم اللاعب", group: "لاعب" },
  { key: "TeamName", label: "اسم الفريق", group: "لاعب" },
  { key: "OpponentTeamName", label: "الفريق الخصم", group: "لاعب" },
  { key: "MatchDate", label: "التاريخ", group: "مباراة" },
  { key: "MatchTime", label: "الوقت", group: "مباراة" },
  { key: "RoundName", label: "الجولة", group: "مباراة" },
  { key: "TableName", label: "الطاولة", group: "مكان" },
  { key: "LocationDescription", label: "المكان", group: "مكان" },
  { key: "TournamentTitle", label: "البطولة", group: "بطولة" },
  { key: "GroupName", label: "المجموعة", group: "بطولة" },
] as const;

export const PLACEHOLDER_GROUPS = ["لاعب", "مباراة", "مكان", "بطولة"] as const;

export function fillNotificationPreview(
  text: string,
  samples: Record<string, string>,
): string {
  return text.replace(/\{([A-Za-z0-9]+)\}/g, (match, key: string) => {
    const value = samples[key];
    return value === undefined || value === "" ? match : value;
  });
}

export type GroupNotificationTemplateId =
  | "upcomingMatch"
  | "placeAndTable"
  | "custom";

export const GROUP_NOTIFICATION_TEMPLATES: {
  id: GroupNotificationTemplateId;
  label: string;
  hint: string;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    id: "upcomingMatch",
    label: "موعد المباراة",
    hint: "تاريخ ووقت وطاولة",
    icon: "i-heroicons-clock",
    title: "{TournamentTitle}",
    description:
      "يا {PlayerName}، مباراة فريق {TeamName} القادمة يوم {MatchDate} الساعة {MatchTime} على طاولة {TableName} في {LocationDescription}. {AdditionalMessage}",
  },
  {
    id: "placeAndTable",
    label: "الخصم والطاولة",
    hint: "منافس ومكان اللعب",
    icon: "i-heroicons-map-pin",
    title: "{TournamentTitle} — {GroupName}",
    description:
      "يا {PlayerName}، موعد مباراة فريق {TeamName} هو {MatchDate} الساعة {MatchTime} أمام {OpponentTeamName} على طاولة {TableName}. {AdditionalMessage}",
  },
  {
    id: "custom",
    label: "مخصصة",
    hint: "اكتب رسالتك",
    icon: "i-heroicons-pencil-square",
    title: "{TournamentTitle}",
    description: "يا {PlayerName}، {AdditionalMessage}",
  },
];

export function resolveGroupNotificationActionType(
  isPopup: boolean,
  kind: GroupNotificationActionKind,
): GroupNotificationActionType {
  if (!isPopup) return kind;
  switch (kind) {
    case GROUP_NOTIFICATION_ACTION_KIND.NoAction:
      return "PopUpWithNoAction";
    case GROUP_NOTIFICATION_ACTION_KIND.GoToURL:
      return "PopUpWithGoToURL";
    case GROUP_NOTIFICATION_ACTION_KIND.GoToScreen:
      return "PopUpWithGoToScreen";
    case GROUP_NOTIFICATION_ACTION_KIND.GoToTab:
      return "PopUpWithGoToTab";
  }
}

export function isPopupActionType(actionType: string): boolean {
  return actionType.startsWith("PopUp");
}
