import { ISuccessResult } from "@core/interfaces";
import { SocketController } from "@core/socket";
import { SurrenderUseCase } from "./Surrender";

export class SurrenderSocketController extends SocketController<void> {
  protected async executeImpl(): Promise<ISuccessResult> {
    const { gameId, username } = this.user;

    if (!gameId || !username) {
      return {
        success: false,
        message: "No identity, please refresh the page",
      };
    }

    const useCase = new SurrenderUseCase();
    const result = await useCase.execute({
      gameId,
      username,
    });

    if (result.isFailure) {
      return {
        success: false,
        message: result.error.message,
      };
    }

    this.emitToRoomAll(gameId, "game ended", result.value);

    return { success: true };
  }
}
