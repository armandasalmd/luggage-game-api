import { Schema, model, Document } from "mongoose";
import ILobbyInviteModel, { LobbyInviteState } from "./ILobbyInviteModel";
import ILobbyModel from "./ILobbyModel";
import ILobbyPlayerModel from "./ILobbyPlayerModel";

const LobbyInviteSchema = new Schema<ILobbyInviteModel>({
  dateCreated: { type: Date, required: true, default: new Date() },
  senderUsername: { type: String, required: true },
  state: { type: String, default: LobbyInviteState.Pending, enum: LobbyInviteState },
  username: { type: String, required: true },
});

const LobbyPlayerSchema = new Schema<ILobbyPlayerModel>({
  avatar: String,
  ready: { type: Boolean, required: true, default: false },
  seatId: { type: Number, required: true },
  username: { type: String, required: true },
});

const LobbySchema = new Schema<ILobbyModel>({
  createdAt: { type: Date, required: true, default: new Date() },
  gamePrice: { type: Number, required: true },
  gameRules: { type: String, required: true },
  isPrivate: { type: Boolean, required: true },
  invites: [LobbyInviteSchema],
  playerCount: { type: Number, required: true },
  players: [LobbyPlayerSchema],
  roomCode: { type: String, required: true },
  state: { type: String, required: true }
});

export interface LobbyInviteDocument extends ILobbyInviteModel, Document {}
export interface LobbyPlayerDocument extends ILobbyPlayerModel, Document {}
export interface LobbyDocument extends ILobbyModel, Document {}
export default model<ILobbyModel & Document>("lobby", LobbySchema);
