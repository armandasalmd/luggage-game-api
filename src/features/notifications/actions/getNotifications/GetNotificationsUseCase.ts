import { IUseCase, Result } from "@core/logic";
import { INotification } from "@features/notifications/models/INotification";
import { NotificationsResult } from "@features/notifications/models/NotificationsResult";
import FriendNotificationsUseCase from "./FriendNotificationsUseCase";
import LobbyNotificationsUseCase from "./LobbyNotificationsUseCase";

export default class GetNotificationsUseCase implements IUseCase<string, NotificationsResult> {
  async execute(username: string): Promise<Result<NotificationsResult>> {
    const friendNotifResult = await new FriendNotificationsUseCase().execute(username);

    if (friendNotifResult.isFailure) return friendNotifResult;

    const lobbyNotifResult = await new LobbyNotificationsUseCase().execute(username);

    if (lobbyNotifResult.isFailure) return lobbyNotifResult;

    const notifications = [...friendNotifResult.value.notifications, ...lobbyNotifResult.value.notifications];

    return Result.ok({ notifications: this.sortNotifications(notifications) });
  }

  private sortNotifications(notifications: INotification[]): INotification[] {
    return notifications.sort((a, b) => {
      if (a.date instanceof Date && b.date instanceof Date) {
        return a.date.getTime() > b.date.getTime() ? -1 : 1;
      }
      return 0;
    });
  }
}
