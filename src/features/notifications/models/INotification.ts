export type NotificationType = "friendInvite" | "lobbyInvite";

export interface FriendMetaData {
  username: string;
}

export interface LobbyMetaData {
  price: number;
  players: number;
  playersMax: number;
  roomId: string;
}

export interface INotification {
  date: Date;
  description: string;
  image?: string;
  metaData?: LobbyMetaData | FriendMetaData;
  title: string;
  type: NotificationType;
}