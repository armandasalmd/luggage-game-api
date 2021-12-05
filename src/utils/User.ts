import { UserDocument } from "@database";

export function getPayload(user: UserDocument) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };
}