import { HttpController, Request, IHttpResult } from "@core/logic";
import { LoginRequest } from "@features/users/models/LoginRequest";
import LoginUseCase from "./LoginUseCase";
import { getEmptyErrors } from "@utils/Global";

export class LoginController extends HttpController {
  protected async executeImpl(req: Request): Promise<void | IHttpResult> {
    const useCase = new LoginUseCase();
    const request: LoginRequest = {
      username: req.body.username,
      password: req.body.password
    };

    const emptyErrors = getEmptyErrors(request);
    
    if (emptyErrors) {
      return { statusCode: 400, body: emptyErrors };
    }

    if (request.username.length < 4) {
      return {
        statusCode: 400,
        body: {
          errors: {
            username: "Invalid username",
          },
        },
      } as IHttpResult;
    }

    const result = await useCase.execute(request);

    this.respondWithResult(result);
    // or alternatively: return result;
  }
}