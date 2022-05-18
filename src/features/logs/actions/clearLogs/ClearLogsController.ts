import { HttpValidatedController, IUserRequest } from "@core/logic";
import { ClearLogsRequest } from "./ClearLogsModels";
import { ClearLogsUseCase } from "./ClearLogs";

export class ClearLogsController extends HttpValidatedController {
  protected validationClass = ClearLogsRequest;

  protected async executeImpl(req: IUserRequest<ClearLogsRequest>) {
    const useCase = new ClearLogsUseCase();
    const result = await useCase.execute(req.body.types);

    this.ok({
      success: result.isSuccess,
      message: `Successfully removed ${result.value} logs`,
    })
  }
}
