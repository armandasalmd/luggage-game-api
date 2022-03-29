import { Schema, model, Document } from "mongoose";
import ILogModel, { LogType } from "./ILogModel";

const LogSchema = new Schema<ILogModel>({
  dateCreated: { type: Date, required: true, default: new Date() },
  message: { type: String, required: true },
  type: { type: String, default: LogType.None, enum: LogType, required: true },
  username: { type: String, required: true },
});

export interface ILogDocument extends ILogModel, Document {}
export default model<ILogModel & Document>("log", LogSchema);
