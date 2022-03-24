import SocketApp from "../../../../SocketApp";
import { IUseCase, Result } from "@core/logic";
import { PushNotificationsQuery } from "@features/notifications/models/PushNotificationsQuery";

export default class PushNotificationsUseCase implements IUseCase<PushNotificationsQuery, void> {
  private socketApp: SocketApp;

  public constructor() {
    this.socketApp = SocketApp.getInstance();
  }
  async execute(query: PushNotificationsQuery): Promise<Result<void>> {
    try {
      this.socketApp.tryEmitToUsername(query.recipientUsername, "notifications push", query.notifications);
    } catch {
      return Result.fail("Server error");
    }

    return Result.ok();
  }
}
