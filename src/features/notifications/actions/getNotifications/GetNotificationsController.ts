import { HttpController, IUserRequest, Result } from "@core/logic";
import { IResponseBody } from "@core/interfaces";
import { NotificationsResult } from "@features/notifications/models/NotificationsResult";

import GetNotificationsUseCase from "./GetNotificationsUseCase";

export class GetNotificationsController extends HttpController {
  protected async executeImpl(req: IUserRequest<void>): Promise<void> {
    let result: Result<NotificationsResult>;

    try {
      result = await new GetNotificationsUseCase().execute(req.user.username);
    } catch {
      this.fail("Server error");
      return;
    }
    
    if (result.isFailure) {
      this.fail(result.error);
    } else {
      this.ok({
        statusCode: 200,
        data: result.value
      } as IResponseBody);
    }
  }
}