import { HttpController, IHttpResult, IUserRequest, Result } from "@core/logic";
import { SearchRequest } from "@features/friends/models/SearchRequest";
import { SearchResponse } from "@features/friends/models/SearchResponse";
import { SearchUseCase } from "./SearchUseCase";

export class SearchController extends HttpController {
  protected async executeImpl(
    req: IUserRequest<SearchRequest>
  ): Promise<Result<SearchResponse> | IHttpResult> {
    const useCase = new SearchUseCase();
    const error = this.validate(req.body);

    if (error) {
      return {
        statusCode: 200,
        body: {
          errorMessage: error,
        },
      } as IHttpResult;
    }

    req.body.clientUsername = req.user.username;

    return await useCase.execute(req.body);
  }

  private validate(req: SearchRequest): string {
    if (
      typeof req.pageNumber !== "number" ||
      typeof req.pageSize !== "number" ||
      req.pageNumber <= 0 ||
      req.pageSize <= 0 ||
      req.pageSize > 100
    )
      return "Incorrect pagination";
    if (!req.searchTerm || req.searchTerm.length < 3) return "At least 3 characters required";
  }
}
