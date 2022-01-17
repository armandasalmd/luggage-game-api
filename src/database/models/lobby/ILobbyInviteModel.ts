import { Types } from "mongoose";
import IUserModel from "../user/IUserModel";

export enum LobbyInviteState {
  Pending = "pending",
  Accepted = "accepted"
}

export default interface ILobbyInviteModel {
  user: Types.ObjectId | IUserModel;
  state: LobbyInviteState;
}