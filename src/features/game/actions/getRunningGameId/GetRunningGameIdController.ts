import { HttpController, IUserRequest } from "@core/logic";
import { GetRunningGameIdUseCase } from "./GetRunningGameId";

export class GetRunningGameIdController extends HttpController {
  protected async executeImpl(req: IUserRequest<void>): Promise<void> {
    const useCase = new GetRunningGameIdUseCase();
    const result = await useCase.execute(req.user.username);

    this.respondWithResult(result);
  }
}
