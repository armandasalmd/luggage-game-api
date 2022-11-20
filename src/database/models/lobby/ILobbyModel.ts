import ILobbyInviteModel from "./ILobbyInviteModel";
import { GameRulesType, LobbyStateType } from "@utils/Lobby";
import ILobbyPlayerModel from "./ILobbyPlayerModel";

export default interface ILobbyModel {
  createdAt: Date;
  gamePrice: number;
  gameRules: GameRulesType;
  isPrivate: boolean;
  invites?: ILobbyInviteModel[];
  playerCount: number;
  players?: ILobbyPlayerModel[];
  roomCode: string;
  state: LobbyStateType;
}
