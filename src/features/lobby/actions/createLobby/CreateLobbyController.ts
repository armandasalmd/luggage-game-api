import { HttpValidatedController, IHttpResult, IUserRequest, Result } from "@core/logic";
import { CreateLobbyRequest } from "@features/lobby/models/CreateLobbyRequest";
import CreateLobbyUseCase from "./CreateLobbyUseCase";
import { CreateLobbyResponse } from "@features/lobby/models/CreateLobbyResponse";

export default class CreateLobbyController extends HttpValidatedController {
  protected validationClass = CreateLobbyRequest;

  protected async executeImpl(
    req: IUserRequest<CreateLobbyRequest>
  ): Promise<Result<CreateLobbyResponse> | IHttpResult> {
    const useCase = new CreateLobbyUseCase();
    const result = await useCase.execute(req.body, req.user);

    if (result.isFailure) {
      return {
        statusCode: 200,
        body: {
          errorMessage: result.error.message,
        },
      } as IHttpResult;
    }

    return result;
  }
}
