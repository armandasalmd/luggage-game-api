import { IFriendUser } from "./IFriendUser";

export interface FriendsAndInvitesResponse {
  friends: IFriendUser[];
  invites: IFriendUser[];
}