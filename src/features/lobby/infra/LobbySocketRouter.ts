import { ISocketEvent, ISocketRouter } from "@core/socket";
import JoinLobbyController from "../actions/joinLobby/JoinLobbySocketController";
import LeaveLobbyController from "../actions/leaveLobby/LeaveLobbySocketController";
import PlayerReadyController from "../actions/playerReady/PlayerReadyController";
import { JoinLobbyRequest } from "../models/JoinLobbyRequest";

const joinLobbyEvent: ISocketEvent<JoinLobbyRequest> = {
  eventName: "lobby join",
  controller: new JoinLobbyController(),
};

const leaveLobbyEvent: ISocketEvent<void> = {
  eventName: "lobby leave",
  controller: new LeaveLobbyController(),
};

const playerReadyEvent: ISocketEvent<void> = {
  eventName: "lobby ready",
  controller: new PlayerReadyController(),
};

const LobbySocketRouter: ISocketRouter = {
  events: [joinLobbyEvent, leaveLobbyEvent, playerReadyEvent],
};

export { LobbySocketRouter, leaveLobbyEvent };
