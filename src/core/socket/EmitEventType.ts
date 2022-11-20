export type EmitEventType =
  | "notifications push"
  | "lobbies changed"
  | "lobby player joined"
  | "lobby player left"
  | "lobby player ready"
  | "lobby player waved"
  | "game can start"
  | "game details changed"
  | "game emoji"
  | "game ended"
  | "game luggage taken"
  | "game player pushed cards"
  | "game public player changed"
  | "game player clicked play again";

export const PublicLobbiesRoom = "publicLobbies";