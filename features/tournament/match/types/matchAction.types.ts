export type MatchActionType = "edit" | "reset" | "back" | "copy"|"copyStream";

export type MatchAction = {
  type: MatchActionType;
  label: string;
  icon: string;
};
