import type { DefaultGameSettings } from "~/features/tournament/models/group";

export type LevelGameSettings = DefaultGameSettings;

export interface TournamentRoundUpdate {
  startAt: string;
  gameSettings: LevelGameSettings;
}

/** GET /tournaments/{tournamentId}/stages/{stageId}/levels/game-settings */
export interface StageLevelGameSettings {
  id: string;
  stageId: string;
  level: number;
  gameSettings: LevelGameSettings;
}

/** PUT body — /tournaments/{tournamentId}/stages/{stageId}/levels/{level}/game-settings */
export type UpdateLevelGameSettingsBody = LevelGameSettings;
