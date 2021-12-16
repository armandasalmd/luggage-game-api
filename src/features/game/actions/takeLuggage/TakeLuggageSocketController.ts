import { SocketController } from "@core/socket";
import { TakeLuggageQuery } from "@features/game/models/TakeLuggageQuery";
import TakeLuggageUseCase from "./TakeLuggageUseCase";

export default class TakeLuggageSocketController extends SocketController<TakeLuggageQuery> {
  protected async executeImpl(dataIn: TakeLuggageQuery): Promise<any> {
    if (!dataIn || !dataIn.luggageCard || !dataIn.roomId) {
      return {
        success: false,
        message: "Incorrect request"
      };
    }

    dataIn.username = this.user.username;

    const useCase = new TakeLuggageUseCase();
    const result = await useCase.execute(dataIn);

    if (result.isFailure) {
      return {
        success: false,
        message: result.error.message
      };
    }

    this.emitToRoom(dataIn.roomId, "game player state change", result.value.newPublicState);
    this.emitToClient("game my state change", result.value.newMyState);

    return {
      success: true
    };
  }

}