import { SocketController } from "@core/socket";
import PlayerReadyUseCase from "./PlayerReadyUseCase";

export default class PlayerReadyController extends SocketController<void> {
  protected async executeImpl() {
    const useCase = new PlayerReadyUseCase();
    const result = await useCase.execute(this.user);

    if (result.isSuccess) {
      this.emitToRoom(result.value.roomId, "lobby player ready", this.user.username);

      if (result.value.gameCanStart) {
        this.emitToRoom(result.value.roomId, "game can start", {});
      }

      return {
        success: true,
        gameCanStart: result.value.gameCanStart
      };
    }

    return {
      success: false,
      errorMessage: result.error,
    };
  }
}
