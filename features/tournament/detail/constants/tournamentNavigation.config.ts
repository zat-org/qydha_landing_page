import type {
  TournamentOutletView,
  TournamentTabView,
  ViewMeta,
} from "../types/navigation.types";

export const OUTLET_VIEW_CONFIG = {
  team: {
    label: "الفرق واللاعبين",
    icon: "i-mdi-account-group",
    pathSegment: "team",
  },
  joinRequest: {
    label: "طلبات الانضمام",
    icon: "i-mdi-account-arrow-right",
    pathSegment: "joinrequest",
  },
  group: {
    label: "المجموعات والمباريات",
    icon: "i-mdi-user-group",
    pathSegment: "group",
  },
} as const satisfies Record<TournamentOutletView, ViewMeta>;

export const TAB_VIEW_CONFIG = {
  bracket: {
    label: "خريطة البطولة",
    icon: "i-mdi-tournament",
    pathSegment: "bracket",
  },
  statistics: {
    label: "إحصائيات البطولة",
    icon: "i-mdi-chart-box",
    pathSegment: "statistics",
  },
  refree: {
    label: "الحكام",
    icon: "i-mdi-account-group",
    pathSegment: "refree",
  },
  tables: {
    label: "الطاولات",
    icon: "i-mdi-table-chair",
    pathSegment: "table",
  },
} as const satisfies Record<TournamentTabView, ViewMeta>;
