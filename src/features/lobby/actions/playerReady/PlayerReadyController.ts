import { SocketController } from "@core/socket";
import PlayerReadyUseCase from "./PlayerReadyUseCase";
import StartGameUseCase from "@features/game/actions/startGame/StartGameUseCase";

export default class PlayerReadyController extends SocketController<void> {
  protected async executeImpl() {
    const useCase = new PlayerReadyUseCase();
    const result = await useCase.execute(this.user);

    if (result.isSuccess) {
      this.emitToRoom(
        result.value.roomId,
        "lobby player ready",
        this.user.username
      );

      if (result.value.gameCanStart) {
        // Create game instance in db and then notify clients to start
        const startGameUseCase = new StartGameUseCase();
        const startGameResult = await startGameUseCase.execute(
          result.value.roomId
        );

        if (startGameResult.isSuccess) {
          this.emitToRoom(result.value.roomId, "game can start", {});
        } else {
          return {
            success: false,
            errorMessage: startGameResult.error,
          };
        }
      }

      return {
        success: true,
        gameCanStart: result.value.gameCanStart,
      };
    }

    return {
      success: false,
      errorMessage: "Unexpected error",
    };
  }
}
