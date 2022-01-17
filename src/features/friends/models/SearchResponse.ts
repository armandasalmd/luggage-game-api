import { IPaginatedResult } from "@core/interfaces";
import { IFriendUser } from "./IFriendUser";

export interface SearchResponse extends IPaginatedResult {
  users: IFriendUser[];
}