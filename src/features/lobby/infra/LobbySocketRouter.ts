import { ISocketEvent, ISocketRouter } from "@core/socket";
import JoinLobbyController from "../actions/joinLobby/JoinLobbySocketController";
import LeaveLobbyController from "../actions/leaveLobby/LeaveLobbySocketController";
import PlayerReadyController from "../actions/playerReady/PlayerReadyController";
import SubscribeToLobbiesController from "../actions/publicLobbies/SubscribeToLobbiesSocketController";
import WaveController from "../actions/wave/WaveSocketController";

const joinLobbyEvent: ISocketEvent<string> = {
  eventName: "lobby join",
  controller: () => new JoinLobbyController(),
};

const leaveLobbyEvent: ISocketEvent<void> = {
  eventName: "lobby leave",
  controller: () => new LeaveLobbyController(),
};

const playerReadyEvent: ISocketEvent<void> = {
  eventName: "lobby ready",
  controller: () => new PlayerReadyController(),
};

const subscribeToLobbiesEvent: ISocketEvent<boolean> = {
  eventName: "lobby public subscribe",
  controller: () => new SubscribeToLobbiesController(),
};

const waveEvent: ISocketEvent<string> = {
  eventName: "lobby wave",
  controller: () => new WaveController(),
};

const LobbySocketRouter: ISocketRouter = {
  events: [joinLobbyEvent, leaveLobbyEvent, playerReadyEvent, subscribeToLobbiesEvent, waveEvent],
};

export { LobbySocketRouter, leaveLobbyEvent };
