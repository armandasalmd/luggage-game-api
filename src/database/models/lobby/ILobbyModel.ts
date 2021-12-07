import { GameRulesType, LobbyStateType } from "@utils/Lobby";
import ILobbyPlayerModel from "./ILobbyPlayerModel";

export default interface ILobbyModel {
  playerCount: number;
  gamePrice: number;
  isPrivate: boolean;
  gameRules: GameRulesType;
  state: LobbyStateType;
  players?: ILobbyPlayerModel[];
  roomCode: string;
}