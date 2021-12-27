import { HttpController, IHttpResult, IUserRequest } from "@core/logic";
import { GetCoinsAndRewardsUseCase } from "./GetCoinsAndRewardsUseCase";

export class GetCoinsAndRewardsController extends HttpController {
  protected async executeImpl(req: IUserRequest<void>): Promise<void | IHttpResult> {
    const useCase = new GetCoinsAndRewardsUseCase();

    this.respondWithResult(await useCase.execute(req.user.id));
  }
}