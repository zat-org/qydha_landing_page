export interface IBoardSettings {
  baloot: IBoardSettingsOrinetation;
  hand: IBoardSettingsOrinetation;
}

export interface IUpdateBalootBoardSettings {
  boardId: string;
  portrait: Portrait;
}
interface IBoardSettingsOrinetation {
  portrait: Portrait;
}

interface Portrait {
  dimension: Dimension;
  scorePanel: ScorePanel;
  leftPlayer: LeftPlayer;
  rightPlayer: RightPlayer;
  bottomPlayer: BottomPlayer;
  playerImageWidth: number;
  detailScore: DetailScore;
}

interface Dimension {
  width: number;
  height: number;
}

interface ScorePanel {
  topMargin: number;
  height: number;
  position: Position;
  leftTeam: LeftTeam;
  rightTeam: RightTeam;
}

interface Position {
  scale: number;
  top: number;
  left: number;
}

interface LeftTeam {
  name: Name;
  score: Score;
}

interface RightTeam {
  name: Name;
  score: Score;
}

interface Name {
  size: number;
  top: number;
  left: number;
}

interface Score {
  size: number;
  top: number;
  left: number;
}

interface LeftPlayer {
  top: number;
  left: number;
}

interface RightPlayer {
  top: number;
  right: number;
}

interface BottomPlayer {
  bottom: number;
  left: number;
}

interface DetailScore {
  color: string;
  fontSize: number;
}
