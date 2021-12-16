import { SocketController } from "@core/socket"
import SurrenderUseCase from "./SurrenderUseCase";

export default class SurrenderSocketController extends SocketController<void> {
  protected async executeImpl() {
    const useCase = new SurrenderUseCase();
    const result = await useCase.execute(this.user.username);

    if (result.isFailure) {
      return {
        success: false,
        message: result.error.message
      };
    }

    this.emitToRoom(result.value.roomId, "game details change", result.value.gameDetails);
    this.emitToRoom(result.value.roomId, "game finished", result.value.winners);

    return {
      success: true,
      looseAmount: result.value.looseAmount
    };
  }
}