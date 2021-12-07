import { HttpController, IHttpResult, IUserRequest, Result } from "@core/logic";
import { CreateLobbyRequest } from "@features/lobby/models/CreateLobbyRequest";
import CreateLobbyUseCase from "./CreateLobbyUseCase";
import { gamePrices, gameRules } from "@utils/Lobby";
import { CreateLobbyResponse } from "@features/lobby/models/CreateLobbyResponse";

export default class CreateLobbyController extends HttpController {
  protected async executeImpl(
    req: IUserRequest<CreateLobbyRequest>
  ): Promise<Result<CreateLobbyResponse> | IHttpResult> {
    const validation = this.validation(req.body);

    if (validation) {
      return validation;
    }

    const useCase = new CreateLobbyUseCase();

    return useCase.execute(req.body, req.user);
  }

  private validation(body: CreateLobbyRequest): IHttpResult | undefined {
    if (body.playerCount < 2 || body.playerCount > 5) {
      return {
        statusCode: 200,
        body: {
          errorMessage: "Incorrect player count",
        },
      } as IHttpResult;
    }

    if (!gamePrices.includes(body.gamePrice)) {
      return {
        statusCode: 200,
        body: {
          errorMessage: "Incorrect game price",
        },
      } as IHttpResult;
    }

    if (!gameRules.includes(body.gameRules)) {
      return {
        statusCode: 200,
        body: {
          errorMessage: "Incorrect game rules",
        },
      } as IHttpResult;
    }
  }
}
