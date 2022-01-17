import { FilterQuery } from "mongoose";

import { IUseCase, Result } from "@core/logic";
import { FriendDocument, FriendModel, FriendState, IFriendModel } from "@database";
import { RespondInviteQuery } from "@features/friends/models/RespondInviteQuery";

export class RespondInviteUseCase implements IUseCase<RespondInviteQuery, void> {
  async execute(query: RespondInviteQuery): Promise<Result<void>> {
    const filter: FilterQuery<FriendDocument> = {
      requestingUser: query.username,
      $or: [ { username1: query.clientUsername }, { username2: query.clientUsername } ]
    };

    let result: IFriendModel;

    if (query.accept === true) {
      result = await FriendModel.findOneAndUpdate(filter, {
        state: FriendState.Friends
      });
    } else {
      result = await FriendModel.findOneAndRemove(filter);
    }

    if (result === null) return Result.fail("Cannot respond to invite");

    return Result.ok();
  }
}
