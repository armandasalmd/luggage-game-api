import { Schema, model, Document } from "mongoose";
import { IGameLogModel } from "./IGameLogModel";

const GameLogSchema = new Schema<IGameLogModel>({
  date: { type: Date, required: true, default: new Date() },
  place: { type: String, required: true },
  playerCount: { type: Number, required: true },
  reward: { type: Number, required: true },
  roomId: { type: String, required: true },
  username: { type: String, required: true },
});

export interface GameLogDocument extends IGameLogModel, Document {}
export default model<IGameLogModel & Document>("gameLog", GameLogSchema);
