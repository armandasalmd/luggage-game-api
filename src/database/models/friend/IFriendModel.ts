import { Types } from "mongoose";
import IUserModel from "../user/IUserModel";

export enum FriendState {
  None = "none",
  Pending = "pending",
  Friends = "friends",
}

export default interface IFriendModel {
  dateCreated: Date;
  friendsSince?: Date;
  requestingUser: string;
  state: FriendState;

  username1: string;
  user1: Types.ObjectId | IUserModel;

  username2: string;
  user2: Types.ObjectId | IUserModel;
}
