import { SocketController } from "@core/socket";
import PlayerReadyUseCase from "./PlayerReadyUseCase";
import { StartGameUseCase } from "@features/game/actions/startGame";

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
        const startGameResult = await startGameUseCase.execute({
          lobbyId: result.value.roomId
        });

        if (startGameResult.isSuccess) {
          this.emitToRoomAll(result.value.roomId, "game can start", null);
        } else {
          return {
            success: false,
            errorMessage: startGameResult.error,
          };
        }
      }

      return { success: true };
    }

    return {
      success: false,
      errorMessage: "Unexpected error",
    };
  }
}
