import { Types } from "mongoose";

import { IUseCase, Result } from "@core/logic";
import { FriendModel, IFriendModel, FriendState, UserDocument, UserModel } from "@database";
import { AddFriendRequest } from "@features/friends/models/AddFriendRequest";
import { AddFriendResult } from "@features/friends/models/AddFriendResult";
import { INotification } from "@features/notifications/models/INotification";
import { IPayload } from "@core/interfaces";

export class AddFriendUseCase implements IUseCase<AddFriendRequest, AddFriendResult> {
  async execute(request: AddFriendRequest, user: IPayload): Promise<Result<AddFriendResult>> {
    if (await this.inviteExists(request, user)) return Result.fail("Invite already exists");

    const friendUser: UserDocument = await UserModel.findOne(
      { username: request.friendUsername },
      { id: 1 }
    );

    if (!friendUser) return Result.fail("User not found");

    const friendProps: IFriendModel = {
      requestingUser: user.username,
      state: FriendState.Pending,
      username1: user.username,
      username2: request.friendUsername,
      user1: new Types.ObjectId(user.id),
      user2: friendUser._id,
      dateCreated: new Date()
    };

    const friend = new FriendModel(friendProps);
    await friend.save();

    return Result.ok({ notification: this.createNotification(friend, user) });
  }

  private async inviteExists(request: AddFriendRequest, sender: IPayload): Promise<number> {
    return await FriendModel.countDocuments({
      requestingUser: sender.username,
      username2: request.friendUsername
    });
  }

  private createNotification(friend: IFriendModel, sender: IPayload): INotification {
    return {
      date: friend.dateCreated,
      description: "Requested to add you as a friend",
      title: sender.username,
      type: "friendInvite",
      image: sender.avatar,
      metaData: {
        username: sender.username
      }
    };
  }
}
