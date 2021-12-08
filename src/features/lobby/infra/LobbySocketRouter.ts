import { ISocketEvent, ISocketRouter } from "@core/socket";
import JoinLobbyController from "../actions/joinLobby/JoinLobbySocketController";
import { JoinLobbyRequest } from "../models/JoinLobbyRequest";

const joinLobbyEvent: ISocketEvent<JoinLobbyRequest> = {
  eventName: "lobby join",
  controller: new JoinLobbyController(),
};

const LobbySocketRouter: ISocketRouter = {
  events: [joinLobbyEvent],
};

export { LobbySocketRouter };
