import { HttpController, IHttpResult, IUserRequest } from "@core/logic";
import { ClaimDailyRewardUseCase } from "./ClaimDailyRewardUseCase";

export class ClaimDailyRewardController extends HttpController {
  protected async executeImpl(req: IUserRequest<void>): Promise<void | IHttpResult> {
    const useCase = new ClaimDailyRewardUseCase();

    this.respondWithResult(await useCase.execute(req.user.id));
  }
}