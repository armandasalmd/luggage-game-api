import { HttpValidatedController, IUserRequest, Result } from "@core/logic";
import { HistoryRequest } from "../../models/HistoryRequest";
import { HistoryResponse } from "../../models/HistoryResponse";
import HistoryUseCase from "./HistoryUseCase";

export class HistoryController extends HttpValidatedController {
  protected validationClass = HistoryRequest;

  protected async executeImpl(req: IUserRequest<HistoryRequest>): Promise<Result<HistoryResponse>> {
    const useCase = new HistoryUseCase();

    return await useCase.execute(req.body, req.user);
  }
}