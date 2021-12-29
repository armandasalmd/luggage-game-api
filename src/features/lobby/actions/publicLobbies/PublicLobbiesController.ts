import { HttpController, IUserRequest, IHttpResult, Result } from "@core/logic";
import { PublicLobbiesRequest } from "@features/lobby/models/PublicLobbiesRequest";
import { PublicLobbiesResponse } from "@features/lobby/models/PublicLobbiesResponse";
import PublicLobbiesUseCase from "./PublicLobbiesUseCase";
import { gamePrices, gameRules } from "@utils/Lobby";

export default class PublicLobbiesController extends HttpController {
  protected async executeImpl(
    req: IUserRequest<PublicLobbiesRequest>
  ): Promise<IHttpResult | Result<PublicLobbiesResponse>> {
    const error = this.validation(req.body);
    if (error) return error;

    const useCase = new PublicLobbiesUseCase();

    return await useCase.execute(req.body);
  }

  private validation(body: PublicLobbiesRequest): IHttpResult | undefined {
    if (body.pageNumber <= 0 || body.pageSize < 1) {
      return {
        statusCode: 200,
        body: {
          errorMessage: "Incorrect pagination choice",
        },
      } as IHttpResult;
    }

    if (body.gamePrice !== undefined && !gamePrices.includes(body.gamePrice)) {
      return {
        statusCode: 200,
        body: {
          errorMessage: "Incorrect game price",
        },
      } as IHttpResult;
    }

    if (body.gameMode !== undefined && !gameRules.includes(body.gameMode)) {
      return {
        statusCode: 200,
        body: {
          errorMessage: "Incorrect game rules",
        },
      } as IHttpResult;
    }
  }
}
