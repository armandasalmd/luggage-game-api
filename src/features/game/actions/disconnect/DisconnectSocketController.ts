import { ISuccessResult } from "@core/interfaces";
import { SocketController } from "@core/socket";
import { IPublicPlayerState } from "@features/game/models";
import { DisconnectUseCase } from "./Disconnect";

export class DisconnectSocketController extends SocketController<void> {
  protected async executeImpl(): Promise<ISuccessResult> {
    const { gameId, username } = this.user;
    const useCase = new DisconnectUseCase();
    const result = await useCase.execute({ gameId, username, connected: false });

    if (result.isSuccess) {
      const payload: Partial<IPublicPlayerState> = {
        connected: false,
        seatId: result.value,
        username
      };

      this.emitToRoom(gameId, "game public player changed", payload)
    }

    return {
      success: result.isSuccess,
      message: result.isFailure ? result.error.message : undefined
    };
  }
}