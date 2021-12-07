import { ILobbyPlayerModel } from "@database";

export interface CreateLobbyResponse {
  players?: ILobbyPlayerModel[];
  roomCode?: string;
  errorMessage?: string; 
}
