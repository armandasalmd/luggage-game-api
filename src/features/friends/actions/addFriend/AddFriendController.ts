import { HttpController, IHttpResult, IUserRequest } from "@core/logic";
import { AddFriendRequest } from "@features/friends/models/AddFriendRequest";
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

    req.body.clientUserId = req.user.id;
    req.body.clientUsername = req.user.username;

    const result = await useCase.execute(req.body);

    if (result.isFailure) {
      return this.errorResponse(result.error.message);
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
