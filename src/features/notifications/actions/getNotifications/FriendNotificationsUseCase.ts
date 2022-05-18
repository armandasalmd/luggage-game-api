import { IUseCase, Result } from "@core/logic";
import { GetInvitesUseCase } from "@features/friends/actions/getInvites/GetInvitesUseCase";
import { IFriendUser } from "@features/friends/models/IFriendUser";
import { FriendMetaData, INotification } from "@features/notifications/models/INotification";
import { NotificationsResult } from "@features/notifications/models/NotificationsResult";

export default class FriendNotificationsUseCase implements IUseCase<string, NotificationsResult> {
  async execute(username: string): Promise<Result<NotificationsResult>> {
    const friendsResult = await new GetInvitesUseCase().execute(username);

    if (friendsResult.isFailure) return Result.fail(friendsResult.error);

    return Result.ok({
      notifications: friendsResult.value.invites.map(this.toNotification)
    });
  }

  private toNotification(friendInvite: IFriendUser): INotification {
    if (!friendInvite) return null;

    const metaData: FriendMetaData = {
      username: friendInvite.username
    };

    return {
      date: friendInvite.dateCreated,
      description: "Requested to add you as a friend",
      title: friendInvite.username,
      type: "friendInvite",
      image: friendInvite.avatar,
      metaData
    };
  }
}
