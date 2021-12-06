import { HttpController, Request, IHttpResult } from "@core/logic";
import { LoginRequest } from "@features/users/models/LoginRequest";
import LoginUseCase from "./LoginUseCase";
import { getEmptyErrors } from "@utils/Global";
import { emailIsValid } from "@utils/Global";

export class LoginController extends HttpController {
  protected async executeImpl(req: Request): Promise<void | IHttpResult> {
    const useCase = new LoginUseCase();
    const request: LoginRequest = {
      email: req.body.email,
      password: req.body.password
    };

    const emptyErrors = getEmptyErrors(request);
    
    if (emptyErrors) {
      this.json(400, emptyErrors);
    }

    if (!emailIsValid(request.email)) {
      return {
        statusCode: 400,
        body: {
          errors: {
            email: "Invalid email address",
          },
        },
      } as IHttpResult;
    }

    const result = await useCase.execute(request);

    this.respondWithResult(result);
    // or alternatively: return result;
  }
}