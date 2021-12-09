import { HttpController, IHttpResult, IUserRequest, Result } from "@core/logic";
import GetGameStateRequest from "@features/game/models/GetGameStateRequest";
import { GetGameStateResponse } from "@features/game/models/GetGameStateResponse";
import GetGameStateUseCase from "./GetGameStateUseCase";

export default class GetGameStateController extends HttpController {
  protected async executeImpl(req: IUserRequest<GetGameStateRequest>): Promise<Result<GetGameStateResponse> | IHttpResult> {
    const roomId = req.body.roomId;

    if (!roomId || typeof roomId !== "string") {
      this.clientError("Please provide room id");
      return;
    }

    const useCase = new GetGameStateUseCase();
    const result = await useCase.execute({
      roomId,
      requestingUsername: req.user.username
    });

    this.respondWithResult(result);
  }
}
