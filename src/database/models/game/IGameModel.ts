import IPlayerModel from "./IPlayerModel";
import { GameRulesType } from "@utils/Lobby";

export default interface IGameModel {
  deadDeck: string[];
  playDeck: string[];
  sourceDeck: string[];
  running: boolean;
  activeSeatId: number;
  players: IPlayerModel[];
  roomId: string;
  rulesMode: GameRulesType;
  gamePrice: number;
}