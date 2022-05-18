import { HttpValidatedController, IUserRequest } from "@core/logic";
import { GetGameStateRequest } from "./GetGameStateModels";
import { GetGameStateUseCase } from "./GetGameState";

export class GetGameStateController extends HttpValidatedController {
  protected validationClass = GetGameStateRequest;

  protected async executeImpl(req: IUserRequest<GetGameStateRequest>) {
    const useCase = new GetGameStateUseCase();
    const result = await useCase.execute({
      gameId: req.body.gameId,
      username: req.user.username,
    });
    
    this.respondWithResult(result);
  }
}
