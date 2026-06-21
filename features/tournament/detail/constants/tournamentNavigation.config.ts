import type {
  TournamentOutletView,
  TournamentTabView,
  TabViewMeta,
} from "../types/navigation.types";

export const OUTLET_PATH_SEGMENTS = {
  team: "team",
  joinRequest: "joinrequest",
  group: "group",
} as const satisfies Record<TournamentOutletView, string>;

export const TAB_VIEW_CONFIG = {
  bracket: {
    label: "خريطة البطولة",
    icon: "i-mdi-tournament",
    pathSegment: "bracket",
    openInNewTab: true,
  },
  statistics: {
    label: "إحصائيات البطولة",
    icon: "i-mdi-chart-box",
    pathSegment: "statistics",
    openInNewTab: true,
  },
  refree: {
    label: "الحكام",
    icon: "i-mdi-account-group",
    pathSegment: "refree",
    openInNewTab: false,
  },
  tables: {
    label: "الطاولات",
    icon: "i-mdi-table-chair",
    pathSegment: "table",
    openInNewTab: false,
  },
} as const satisfies Record<TournamentTabView, TabViewMeta>;

/** Tab views shown in the tournament header settings menu (display order). */
export const SETTINGS_MENU_TAB_VIEWS = [
  "tables",
  "refree",
  "bracket",
  "statistics",
] as const satisfies readonly TournamentTabView[];
