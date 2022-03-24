import { Types } from "mongoose";
import IUserModel from "../user/IUserModel";

export enum LobbyInviteState {
  Accepted = "accepted",
  Pending = "pending"
}

export default interface ILobbyInviteModel {
  dateCreated: Date;
  senderUsername: string;
  state: LobbyInviteState;
  username: string;
}