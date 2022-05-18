import { HttpValidatedController, IUserRequest, Result } from "@core/logic";
import { GetHistoryRequest, GetHistoryResponse } from "./GetHistoryModels";
import { GetHistoryUseCase } from "./GetHistory";

export class HistoryController extends HttpValidatedController {
  protected validationClass = GetHistoryRequest;

  protected async executeImpl(
    req: IUserRequest<GetHistoryRequest>
  ): Promise<Result<GetHistoryResponse>> {
    const useCase = new GetHistoryUseCase();

    return await useCase.execute(req.body, req.user);
  }
}
