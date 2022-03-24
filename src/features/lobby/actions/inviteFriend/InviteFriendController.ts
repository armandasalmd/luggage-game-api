import { Server } from "socket.io";

import { HttpController, IUserRequest, ISuccessResult, Result } from "@core/logic";
import { InviteFriendRequest } from "@features/lobby/models/InviteFriendRequest";
import InviteFriendUseCase from "./InviteFriendUseCase";
import PushNotificationsUseCase from "@features/notifications/actions/pushNotifications/PushNotificationsUseCase";
import { INotification } from "@features/notifications/models/INotification";

export class InviteFriendController extends HttpController {

  protected async executeImpl(
    req: IUserRequest<InviteFriendRequest>
  ): Promise<Result<ISuccessResult>> {
    if (typeof req.body.username !== "string" || req.body.username === "") {
      return this.createError("Username is required");
    }

    if (req.body.username === req.user.username) {
      return this.createError("Cannot invite yourself");
    }

    const useCase = new InviteFriendUseCase();
    const result = await useCase.execute(req.body, req.user);

    if (result.isFailure) {
      return this.createError(result.error.message);
    }

    try {
      new PushNotificationsUseCase().execute({
        notifications: [result.value.notification],
        recipientUsername: req.body.username
      });
    } catch {
      console.warn("Cannot push add friend notification");
    }

    return Result.ok({ success: true });
  }

  private createError(message: string): Result<ISuccessResult> {
    return Result.ok({
      success: false,
      message,
    });
  }
}
