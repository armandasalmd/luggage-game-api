import { HttpController, IHttpResult, IUserRequest } from "@core/logic";
import { GetCoinsUseCase } from "./GetCoinsUseCase";

export class GetCoinsController extends HttpController {
  protected async executeImpl(req: IUserRequest): Promise<void | IHttpResult> {
    const useCase = new GetCoinsUseCase();

    this.respondWithResult(await useCase.execute(req.user.email));
  }
}