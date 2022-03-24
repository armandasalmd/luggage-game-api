import { HttpController, IUserRequest } from "@core/logic";
import { IResponseBody } from "@core/interfaces";

import GetNotificationsUseCase from "./GetNotificationsUseCase";

export class GetNotificationsController extends HttpController {
  protected async executeImpl(req: IUserRequest<void>): Promise<void> {
    const result = await new GetNotificationsUseCase().execute(req.user.username);

    if (result.isFailure) {
      this.fail(result.error);
      return;
    }

    this.ok({
      statusCode: 200,
      data: result.value
    } as IResponseBody);
  }
}