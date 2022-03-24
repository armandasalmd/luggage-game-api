import { HttpValidatedController, IUserRequest, Result } from "@core/logic";
import { RespondInviteRequest } from "../../models/RespondInviteRequest";
import { RespondInviteUseCase } from "./RespondInviteUseCase";

export class RespondInviteController extends HttpValidatedController {
  protected validationClass = RespondInviteRequest;

  protected async executeImpl(req: IUserRequest<RespondInviteRequest>): Promise<Result<void>> {
    return await new RespondInviteUseCase().execute(req.body, req.user);
  }
}
