import { Types } from "mongoose";

import { IUseCase, Result } from "@core/logic";
import { AddFriendRequest } from "@features/friends/models/AddFriendRequest";
import { FriendModel, IFriendModel, FriendState, UserDocument, UserModel } from "@database";

export class AddFriendUseCase implements IUseCase<AddFriendRequest, void> {
  async execute(request: AddFriendRequest): Promise<Result<void>> {
    if (await this.inviteExists(request)) return Result.fail("Invite already exists");

    const friendUser: UserDocument = await UserModel.findOne(
      { username: request.friendUsername },
      { id: 1 }
    );

    if (!friendUser) return Result.fail("User not found");

    const friendProps: IFriendModel = {
      requestingUser: request.clientUsername,
      state: FriendState.Pending,
      username1: request.clientUsername,
      username2: request.friendUsername,
      user1: new Types.ObjectId(request.clientUserId),
      user2: friendUser._id,
    };

    const friend = new FriendModel(friendProps);
    await friend.save();

    return Result.ok();
  }

  private async inviteExists(request: AddFriendRequest): Promise<number> {
    return await FriendModel.countDocuments({
      requestingUser: request.clientUsername,
      username2: request.friendUsername
    });
  }
}
