import { IUseCase, Result } from "@core/logic";
import { FriendModel, IFriendModel, FriendState } from "@database";
import { GetInvitesResult } from "@features/friends/models/GetInvitesResult";
import { IFriendUser } from "@features/friends/models/IFriendUser";
import { escapeRegExp } from "@utils/Global";
import { FilterQuery } from "mongoose";

interface IAggregatedFriend extends IFriendModel {
  avatar1?: string;
  avatar2?: string;
}

export class GetInvitesUseCase implements IUseCase<string, GetInvitesResult> {
  async execute(clientUsername: string): Promise<Result<GetInvitesResult>> {
    const clientRegex = new RegExp("^" + escapeRegExp(clientUsername) + "$");
    const dbQuery: FilterQuery<IFriendModel> = {
      $or: [{ username1: clientUsername }, { username2: clientUsername }],
      state: FriendState.Pending,
      requestingUser: { $not: clientRegex }
    };
    const dbProject: any= {
      state: 1,
      username1: 1,
      username2: 2,
      avatar1: 1,
      avatar2: 1
    };

    const pendings: IAggregatedFriend[] = await FriendModel.aggregate([
      { $match: dbQuery },
      { $lookup: { from: "users", localField: "user1", foreignField: "_id", as: "user1" } },
      { $lookup: { from: "users", localField: "user2", foreignField: "_id", as: "user2" } },
      { $unwind: "$user1" },
      { $unwind: "$user2" },
      { $addFields: { avatar1: "$user1.avatar", avatar2: "$user2.avatar" } },
      { $project: dbProject }
    ]);

    return Result.ok({
      invites: pendings ? pendings.map(item => this.toFriendUser(item, clientUsername)) : []
    });
  }

  private toFriendUser(friend: IAggregatedFriend, clientUsername: string): IFriendUser {
    return {
      state: friend.state,
      username: clientUsername === friend.username1 ? friend.username2 : friend.username1,
      avatar: clientUsername === friend.username1 ? friend.avatar2 : friend.avatar1
    };
  }
}
