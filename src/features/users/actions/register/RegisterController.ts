import { HttpController, Request, Result, IHttpResult } from "@core/logic";
import { RegisterRequest } from "@features/users/models/RegisterRequest";
import RegisterUseCase from "./RegisterUseCase";
import { getEmptyErrors } from "@utils/Global";
import { RegisterResponse } from "@features/users/models/RegisterResponse";

export class RegisterController extends HttpController {
  protected async executeImpl(
    req: Request
  ): Promise<Result<RegisterResponse> | IHttpResult> {
    const useCase = new RegisterUseCase();
    const request: RegisterRequest = {
      username: req.body.username,
      password: req.body.password,
      password2: req.body.password2,
    };

    const emptyErrors = getEmptyErrors(request);

    if (emptyErrors) {
      return { statusCode: 400, body: emptyErrors };
    }

    if (request.username.length > 16) {
      return this.createErrorBody("username", "Maximum 16 characters allowed");
    }

    if (request.username.length < 5) {
      return this.createErrorBody("username", "Minumum 5 characters allowed");
    }

    if (request.password.length < 8) {
      return this.createErrorBody("password", "Minimum 8 characters required");
    }

    if (request.password !== request.password2) {
      return this.createErrorBody("password", "Passwords don't match");
    }

    return await useCase.execute(request);
    // or this.respondWithResult(result);
  }

  private createErrorBody(name: string, message: string): IHttpResult {
    return {
      statusCode: 400,
      body: {
        errors: {
          [name]: message,
        },
      },
    } as IHttpResult;
  }
}
