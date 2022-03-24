import { HttpController, IHttpResult, IUserRequest } from "@core/logic";
import { AddFriendRequest } from "@features/friends/models/AddFriendRequest";
import PushNotificationsUseCase from "@features/notifications/actions/pushNotifications/PushNotificationsUseCase";
import { AddFriendUseCase } from "./AddFriendUseCase";

export class AddFriendController extends HttpController {
  protected async executeImpl(req: IUserRequest<AddFriendRequest>): Promise<void | IHttpResult> {
    const useCase = new AddFriendUseCase();
    const error = this.validate(req.body);

    if (error) {
      return this.errorResponse(error);
    }

    if (req.user.username === req.body.friendUsername) {
      return this.errorResponse("Cannot add yourself");
    }

    const result = await useCase.execute(req.body, req.user);

    if (result.isFailure) {
      return this.errorResponse(result.error.message);
    }

    try {
      new PushNotificationsUseCase().execute({
        notifications: [result.value.notification],
        recipientUsername: req.body.friendUsername
      });
    } catch {
      console.warn("Cannot push add friend notification");
    }

    this.ok();
  }

  private validate(req: AddFriendRequest): string {
    if (!req.friendUsername) return "Friend username missing";
  }

  private errorResponse(message: string): IHttpResult {
    return {
      statusCode: 200,
      body: {
        errorMessage: message,
      },
    };
  }
}
