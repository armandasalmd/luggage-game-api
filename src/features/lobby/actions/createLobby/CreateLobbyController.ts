import { HttpController, IHttpResult, IUserRequest, Result } from "@core/logic";
import { CreateLobbyRequest } from "@features/lobby/models/CreateLobbyRequest";
import CreateLobbyUseCase from "./CreateLobbyUseCase";
import { CreateLobbyResponse } from "@features/lobby/models/CreateLobbyResponse";
import { gamePrices, gameRules } from "@utils/Lobby";

export default class CreateLobbyController extends HttpController {
  protected async executeImpl(
    req: IUserRequest<CreateLobbyRequest>
  ): Promise<Result<CreateLobbyResponse> | IHttpResult> {
    const validation = this.validation(req.body);

    if (validation) {
      return validation;
    }

    const useCase = new CreateLobbyUseCase();
    const result = await useCase.execute(req.body, req.user); 

    if (result.isFailure) {
      return {
        statusCode: 200,
        body: {
          errorMessage: result.error.message
        }
      } as IHttpResult;
    }

    return result;
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
