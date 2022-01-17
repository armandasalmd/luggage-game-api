import { IUseCase, Result } from "@core/logic";
import { FriendModel } from "@database";
import { RemoveFriendQuery } from "@features/friends/models/RemoveFriendQuery";

export class RemoveFriendUseCase implements IUseCase<RemoveFriendQuery, void> {
  async execute(query: RemoveFriendQuery): Promise<Result<void>> {
    const result = await FriendModel.findOneAndRemove({
      $or: [
        { username1: query.clientUsername, username2: query.friendUsername },
        { username1: query.friendUsername, username2: query.clientUsername },
      ],
    });

    if (result !== null) {
      return Result.ok();
    } else {
      return Result.fail("Friend connection not found");
    }
  }
}
