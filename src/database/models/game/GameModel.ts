import { Schema, model, Document } from "mongoose";
import IGameModel from "./IGameModel";
import IPlayerModel from "./IPlayerModel";

const PlayerSchema = new Schema<IPlayerModel>({
  username: { type: String, required: true },
  seatId: { type: Number, required: true },
  luggageCards: { type: String, required: true },
  handCards: [{ type: String, required: true }],
  playerState: { type: String, required: true },
  lastMoves: [{ type: String, required: true }],
});

const GameSchema = new Schema<IGameModel>({
  deadDeck: [{ type: String, required: true }],
  playDeck: [{ type: String, required: true }],
  sourceDeck: [{ type: String, required: true }],
  running: { type: Boolean, required: true, default: true },
  activeSeatId: { type: Number, required: true, default: 1 },
  roomId: { type: String, required: true },
  rulesMode: { type: String, required: true },
  players: [PlayerSchema],
  gamePrice: { type: Number, required: true },
});

export interface PlayerDocument extends IPlayerModel, Document {}
export interface GameDocument extends IGameModel, Document {}
export default model<IGameModel & Document>("game", GameSchema);
