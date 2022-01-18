import { Server } from "socket.io";

import { HttpController, IUserRequest, ISuccessResult, Result } from "@core/logic";
import { InviteFriendRequest } from "@features/lobby/models/InviteFriendRequest";
import SocketApp from "../../../../SocketApp";
import InviteFriendUseCase from "./InviteFriendUseCase";

export class InviteFriendController extends HttpController {
  private socketApp: SocketApp;

  public constructor() {
    super();
    this.socketApp = SocketApp.getInstance();
  }

  protected async executeImpl(
    req: IUserRequest<InviteFriendRequest>
  ): Promise<Result<ISuccessResult>> {
    if (typeof req.body.username !== "string" || req.body.username === "") {
      return this.createError("Username is required");
    }

    if (req.body.username === req.user.username) {
      return this.createError("Cannot invite yourself");
    }

    const useCase = new InviteFriendUseCase();
    const result = await useCase.execute(req.body, req.user);

    if (result.isFailure) {
      return this.createError(result.error.message);
    }

    // const userSocketId = this.socketApp.getSocketId(req.body.username);

    // if (userSocketId !== "") {
    //   // TODO: fire notification
    //   console.log("Socket", userSocketId);
    // }
    // else invited user is offline

    return Result.ok({ success: true });
  }

  private createError(message: string): Result<ISuccessResult> {
    return Result.ok({
      success: false,
      message,
    });
  }
}
