import { Schema, model, Document } from "mongoose";
import IUserModel from "./IUserModel";

const UserSchema = new Schema<IUserModel>({
  authStrategies: [String],
  avatar: String,
  coins: { type: Number, required: true },
  email: String,
  firstname: String,
  lastname: String,
  password: String,
  username: { type: String, required: true },
});

UserSchema.virtual("payload").get(function () {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
  };
});

export interface UserDocument extends IUserModel, Document {}
export default model<IUserModel & Document>("user", UserSchema);
