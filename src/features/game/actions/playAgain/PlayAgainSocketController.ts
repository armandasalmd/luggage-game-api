import { ISuccessResult } from "@core/interfaces";
import { SocketController } from "@core/socket";
import { PlayAgainUseCase } from "./PlayAgain";

export class PlayAgainSocketController extends SocketController<void> {
  protected async executeImpl(): Promise<ISuccessResult> {
    const { username, gameId, lobbyId } = this.user;
    
    const useCase = new PlayAgainUseCase();
    const result = await useCase.execute({ lobbyId, username });

    if (result.isSuccess) {
      this.emitToRoom(
        gameId,
        "game player clicked play again",
        this.user.username
      );

      if (result.value.gameCanStart) {
        this.emitToAll("game can start", null);
      }
    }

    return {
      success: result.isSuccess
    };
  }
}