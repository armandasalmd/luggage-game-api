import { HttpController, Request, Result, IHttpResult } from "@core/logic";
import { RegisterRequest } from "@features/users/models/RegisterRequest";
import RegisterUseCase from "./RegisterUseCase";
import { getEmptyErrors } from "@utils/Global";
import { RegisterResponse } from "@features/users/models/RegisterResponse";
import { emailIsValid } from "@utils/Global";

export class RegisterController extends HttpController {
  protected async executeImpl(
    req: Request
  ): Promise<Result<RegisterResponse> | IHttpResult> {
    const useCase = new RegisterUseCase();
    const request: RegisterRequest = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    };

    const emptyErrors = getEmptyErrors(request);

    if (emptyErrors) {
      return { statusCode: 400, body: emptyErrors };
    }

    if (request.username.length > 16) {
      return {
        statusCode: 400,
        body: {
          errors: {
            username: "Maximum 16 characters allowed",
          },
        },
      } as IHttpResult;
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

    if (request.password !== request.password2) {
      return {
        statusCode: 400,
        body: {
          errors: {
            password: "Passwords don't match",
          },
        },
      } as IHttpResult;
    }

    return await useCase.execute(request);
    // or this.respondWithResult(result);
  }

  
}
