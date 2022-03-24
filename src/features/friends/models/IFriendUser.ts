import { FriendState } from "@database";

export interface IFriendUser {
  avatar?: string;
  username: string;
  state: FriendState;
  dateCreated: Date;
}