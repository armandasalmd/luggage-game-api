import { GameRulesType } from "@utils/Lobby";

export interface CreateLobbyRequest {
  playerCount: number;
  gamePrice: number;
  isPrivate: boolean;
  gameRules: GameRulesType;
}