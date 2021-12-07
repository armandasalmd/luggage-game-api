export function genRoomCode() {
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";

  for (let i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export const gamePrices = [0, 100, 250, 500, 1000, 2500, 5000, 10000];
export const gameRules = ["classic"];

export type GameRulesType = "classic";
export type LobbyStateType = "active" | "gameStarted" | "gameFinished";
