import { SocketController } from "@core/socket";
import { PlayCardQuery } from "@features/game/models/PlayCardQuery";
import PlayCardUseCase from "./PlayCardUseCase";

export default class PlayCardController extends SocketController<PlayCardQuery> {
  protected async executeImpl(dataIn: PlayCardQuery) {
    const useCase = new PlayCardUseCase();

    dataIn.username = this.user.username;

    const validationMessage = this.validation(dataIn);
    if (validationMessage) {
      return {
        success: false,
        message: validationMessage,
      };
    }

    const result = await useCase.execute(dataIn);

    if (result.isFailure) {
      return {
        success: false,
        message: result.error.message,
      };
    }

    this.emitToRoomAll(
      dataIn.roomId,
      "game details change",
      result.value.newGameDetailsState
    );
    this.emitToRoom(dataIn.roomId, "game player state change", result.value.newPublicState);
    this.emitToClient("game my state change", result.value.newMyState);

    return {
      success: true,
    };
  }

  private validation(dataIn: PlayCardQuery): string {
    if (dataIn.cards.length < 1) {
      return "Cards length must be at least 1";
    }

    if (!dataIn.roomId) {
      return "Room id must be defined";
    }

    if (!dataIn.username) {
      return "Username not found";
    }

    return "";
  }
}
