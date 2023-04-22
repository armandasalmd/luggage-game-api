import { ISuccessResult } from "@core/interfaces";
import { SocketController } from "@core/socket";
import LeaveLobbyUseCase from "./LeaveLobbyUseCase";

export default class LeaveLobbyController extends SocketController<void> {
  protected async executeImpl(): Promise<ISuccessResult> {
    const useCase = new LeaveLobbyUseCase();
    const result = await useCase.execute(this.user);

    if (result.isSuccess) {
      result.value.lobbyLeftIds.forEach((lobbyId) => {
        this.leaveRoom(lobbyId);
        this.emitToRoom(
          lobbyId,
          "lobby player left",
          result.value.usernameLeft
        );
      });

      return {
        success: true,
      };
    }

    return {
      success: false,
      message: result.error.message,
    };
  }
}
