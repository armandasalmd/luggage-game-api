import { Schema, model, Document } from "mongoose";
import ILobbyInviteModel, { LobbyInviteState } from "./ILobbyInviteModel";
import ILobbyModel from "./ILobbyModel";
import ILobbyPlayerModel from "./ILobbyPlayerModel";

const LobbyInviteSchema = new Schema<ILobbyInviteModel>({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  state: { type: String, default: LobbyInviteState.Pending, enum: LobbyInviteState }
});

const LobbyPlayerSchema = new Schema<ILobbyPlayerModel>({
  avatar: String,
  ready: { type: Boolean, required: true },
  seatId: { type: Number, required: true },
  username: { type: String, required: true },
});

const LobbySchema = new Schema<ILobbyModel>({
  playerCount: { type: Number, required: true },
  gamePrice: { type: Number, required: true },
  isPrivate: { type: Boolean, required: true },
  gameRules: { type: String, required: true },
  state: { type: String, required: true },
  roomCode: { type: String, required: true },
  players: [LobbyPlayerSchema],
  intives: [LobbyInviteSchema]
});

export interface LobbyInviteDocument extends ILobbyInviteModel, Document {}
export interface LobbyPlayerDocument extends ILobbyPlayerModel, Document {}
export interface LobbyDocument extends ILobbyModel, Document {}
export default model<ILobbyModel & Document>("lobby", LobbySchema);
