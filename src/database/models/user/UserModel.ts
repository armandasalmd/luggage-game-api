import { Schema, model, Document } from "mongoose";
import IDailyRewardModel from "./IDailyRewardModel";
import IUserModel from "./IUserModel";

const DailyRewardSchema = new Schema<IDailyRewardModel>({
  lastClaimDay: { type: Number, required: true, default: 0 },
  lastClaimDate: Date,
});

const UserSchema = new Schema<IUserModel>({
  authStrategies: [String],
  avatar: String,
  coins: { type: Number, required: true },
  email: String,
  firstname: String,
  lastname: String,
  password: String,
  username: { type: String, required: true, index: true, unique: true },
  dailyReward: { type: DailyRewardSchema, default: { lastClaimDay: 0, lastClaimDate: new Date() } },
});

UserSchema.virtual("payload").get(function () {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
  };
});

export interface DailyRewardDocument extends IDailyRewardModel, Document {}
export interface UserDocument extends IUserModel, Document {}
export default model<IUserModel & Document>("user", UserSchema);
