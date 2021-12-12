import { SocketController } from "@core/socket";
import JoinLobbyUseCase from "./JoinLobbyUseCase";

export default class JoinLobbyController extends SocketController<string> {
  protected async executeImpl(dataIn: string) {
    const useCase = new JoinLobbyUseCase();
    const result = await useCase.execute({ roomId: dataIn }, this.user);

    if (result.isSuccess) {
      // send joined player object to other lobby players
      this.joinRoom(dataIn);
      this.emitToRoom(dataIn, "lobby player joined", result.value.joinedPlayer);

      return {
        success: true,
        lobbyState: result.value.lobbyState,
      };
    }

    return {
      success: false,
      errorMessage: result.error,
    };
  }
}
