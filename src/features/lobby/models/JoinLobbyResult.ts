import { ILobbyModel, ILobbyPlayerModel } from "@database";

export interface JoinLobbyResult {
  joinedPlayer: ILobbyPlayerModel;
  lobbyState: ILobbyModel;
}