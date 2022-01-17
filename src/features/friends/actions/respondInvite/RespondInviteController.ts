import { HttpController, IUserRequest, Result } from "@core/logic";
import { RespondInviteRequest } from "@features/friends/models/RespondInviteRequest";
import { RespondInviteUseCase } from "./RespondInviteUseCase";

export class RespondInviteController extends HttpController {
  protected async executeImpl(
    req: IUserRequest<RespondInviteRequest>
  ): Promise<Result<void>> {
    const error = this.validate(req.body);

    if (error) {
      this.clientError(error);
      return;
    }

    const useCase = new RespondInviteUseCase();
    const result = await useCase.execute({
      accept: req.body.accept,
      clientUsername: req.user.username,
      username: req.body.username
    });

    return result;
  }

  private validate(data: RespondInviteRequest): string {
    if (typeof data.accept !== "boolean") return "Incorrect accept state";
    if (typeof data.username !== "string" || data.username.length < 3) return "Incorrect username";
  }
}
