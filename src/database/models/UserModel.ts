import { Schema, model, Document } from "mongoose";
import IUserModel from "./IUserModel";

const UserSchema = new Schema<IUserModel>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  coins: { type: Number, required: true },
  password: { type: String, required: true },
  avatar: String,
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
