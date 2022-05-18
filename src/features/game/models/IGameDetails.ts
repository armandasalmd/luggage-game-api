import { GameRulesType } from "@utils/Lobby";

export interface IGameDetails {
  activeSeatId: number;
  deadCardsCount: number;
  gameId: string;
  playDeck?: string[]; // Only in get game state action
  price: number;
  rules: GameRulesType;
  sourceDeckCount: number; 
}
