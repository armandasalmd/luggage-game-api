import { INotification } from "./INotification";

export interface PushNotificationsQuery {
  recipientUsername: string;
  notifications: INotification[];
}