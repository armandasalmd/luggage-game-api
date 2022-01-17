import { HttpController, IUserRequest, Result, IHttpResult } from "@core/logic";
import { RemoveFriendRequest } from "@features/friends/models/RemoveFriendRequest";
import { RemoveFriendUseCase } from "./RemoveFriendUseCase";

export class RemoveFriendController extends HttpController {
  protected async executeImpl(
    req: IUserRequest<RemoveFriendRequest>
  ): Promise<Result<void> | IHttpResult> {
    if (!req.body.username || req.body.username.length < 3) {
      return this.errorResult("Invalid username");
    }

    const useCase = new RemoveFriendUseCase();
    const result = await useCase.execute({
      clientUsername: req.user.username,
      friendUsername: req.body.username,
    });

    if (result.isFailure) return this.errorResult(result.error.message);

    this.ok();
  }

  private errorResult(message: string): IHttpResult {
    return {
      statusCode: 400,
      body: {
        errorMessage: message,
      },
    };
  }
}
