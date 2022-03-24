export type EmitEventType =
  | "notifications push"
  | "lobbies changed"
  | "lobby player joined"
  | "lobby player left"
  | "lobby player ready"
  | "lobby player waved"
  | "game can start"
  | "game details change"
  | "game my state change"
  | "game player state change"
  | "game finished"
  | "game reward"
  | "game looser";

export const PublicLobbiesRoom = "publicLobbies";