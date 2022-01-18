import { Types } from "mongoose";
import IUserModel from "../user/IUserModel";

export enum LobbyInviteState {
  Pending = "pending",
  Accepted = "accepted"
}

export default interface ILobbyInviteModel {
  username: string;
  state: LobbyInviteState;
}