import { HttpController, Request } from "@core/logic";
import { LoginRequest } from "@features/users/models/LoginRequest";
import LoginUseCase from "./LoginUseCase";
import { getEmptyErrors } from "@utils/Global";

export class LoginController extends HttpController {
  protected async executeImpl(req: Request): Promise<void> {
    const useCase = new LoginUseCase();
    const request: LoginRequest = {
      email: req.body.email,
      password: req.body.password
    };

    const emptyErrors = getEmptyErrors(request);
    
    if (emptyErrors) {
      this.json(400, emptyErrors);
    }

    const result = await useCase.execute(request);

    this.respondWithResult(result);
    // or alternatively: return result;
  }
}