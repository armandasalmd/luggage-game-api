import { ILobbyModel } from "@database";
import { IPublicLobbyModel } from "@features/lobby/actions/publicLobbies/PublicLobbiesManager";
import { IPublicGame } from "@features/lobby/models/IPublicGame";

export const gamePrices = [0, 100, 250, 500, 1000, 2500, 5000, 10000];
export const gameRules = ["classic"];

export type GameRulesType = "classic";
export type LobbyStateType = "active" | "gameStarted" | "gameFinished";

export function genRoomCode() {
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";

  for (let i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function getGameRulesTitle(rules: GameRulesType | string): string {
  if (rules === "classic") return "Classic game mode";

  return "No title";
}

export function toPublicGame(lobby: ILobbyModel): IPublicGame {
  return {
    modeTitle: getGameRulesTitle(lobby.gameRules),
    players: lobby.players?.length ?? 0,
    playersMax: lobby.playerCount,
    price: lobby.gamePrice,
    roomId: lobby.roomCode,
  }
}

export function toPublicGame2(lobby: IPublicLobbyModel): IPublicGame {
  return {
    modeTitle: getGameRulesTitle(lobby.gameRules),
    players: lobby.numberOfPlayers,
    playersMax: lobby.playerCount,
    price: lobby.gamePrice,
    roomId: lobby.roomCode,
  };
}
