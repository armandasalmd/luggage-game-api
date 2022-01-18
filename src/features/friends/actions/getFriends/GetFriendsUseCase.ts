import { IUseCase, Result } from "@core/logic";
import { FriendModel, FriendState, IFriendModel, FriendDocument } from "@database";
import { GetFriendsQuery } from "@features/friends/models/GetFriendsQuery";
import { GetFriendsResult } from "@features/friends/models/GetFriendsResult";
import { IFriendUser } from "@features/friends/models/IFriendUser";
import { FilterQuery } from "mongoose";

interface IAggregatedFriend extends IFriendModel {
  avatar1?: string;
  avatar2?: string;
}

export class GetFriendsUseCase implements IUseCase<GetFriendsQuery, GetFriendsResult> {
  private forUsername: string;

  async execute(query: GetFriendsQuery): Promise<Result<GetFriendsResult>> {
    const dbQuery: FilterQuery<FriendDocument> = {
      $or: [{ username1: query.forUsername }, { username2: query.forUsername }],
      state: query.includePending ? /.*/ : FriendState.Friends,
    };
    const dbProject: any = {
      username1: 1,
      username2: 1,
      state: 1,
    };

    let friends: IAggregatedFriend[];

    if (query.includeAvatar) {
      dbProject.avatar1 = 1;
      dbProject.avatar2 = 1;
      
      // Construct db aggregation query/pipeline to include avatars
      friends = await FriendModel.aggregate([
        { $match: dbQuery },
        { $lookup: { from: "users", localField: "user1", foreignField: "_id", as: "user1" } },
        { $lookup: { from: "users", localField: "user2", foreignField: "_id", as: "user2" } },
        { $unwind: "$user1" },
        { $unwind: "$user2" },
        { $addFields: { avatar1: "$user1.avatar", avatar2: "$user2.avatar" } },
        { $project: dbProject }
      ]);
    } else {
      friends = await FriendModel.find(dbQuery, dbProject);
    }

    this.forUsername = query.forUsername;

    return Result.ok({
      friends: friends.map(this.toFriendUser.bind(this)),
    });
  }

  private toFriendUser(friend: IAggregatedFriend) {
    return {
      state: friend.state,
      username: friend.username1 === this.forUsername ? friend.username2 : friend.username1,
      avatar: friend.username1 === this.forUsername ? friend.avatar2 : friend.avatar1
    } as IFriendUser;
  }
}
