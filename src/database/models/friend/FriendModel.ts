import { Schema, model, Document } from "mongoose";
import IFriendModel, { FriendState } from "./IFriendModel";

const FriendSchema = new Schema<IFriendModel>({
  friendsSince: { type: Date, required: false },
  requestingUser: { type: String, required: true },
  state: { type: String, default: FriendState.Pending, enum: FriendState, required: true },
  username1: { type: String, required: true },
  username2: { type: String, required: true },
  user1: { type: Schema.Types.ObjectId, ref: "user" },
  user2: { type: Schema.Types.ObjectId, ref: "user" },
});

export interface FriendDocument extends IFriendModel, Document {}
export default model<IFriendModel & Document>("friend", FriendSchema);
