import { HttpController, IUserRequest } from "@core/logic";
import { ClearCacheUseCase } from "./ClearCache";

export class ClearCacheController extends HttpController {
  protected async executeImpl(req: IUserRequest<void>) {
    const useCase = new ClearCacheUseCase();
    return await useCase.execute(null, req.user);
  }
}
