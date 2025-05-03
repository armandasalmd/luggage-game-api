import { IPayload } from "@core/interfaces";

export interface ISocketPayload extends IPayload {
  gameId?: string;
  lobbyId?: string;
}
