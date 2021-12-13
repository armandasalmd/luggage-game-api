import { HttpController, IUserRequest } from "@core/logic";
import GetRunningGameUseCase from "./GetRunningGameUseCase";

export default class GetRunningGameController extends HttpController {
  protected async executeImpl(req: IUserRequest<void>): Promise<void> {
    const useCase = new GetRunningGameUseCase();
    const result = await useCase.execute(req.user.username);

    this.respondWithResult(result);
  }
}
