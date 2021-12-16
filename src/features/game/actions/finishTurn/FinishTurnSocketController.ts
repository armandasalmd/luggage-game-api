import { SocketController } from "@core/socket";
import { FinishTurnQuery } from "@features/game/models/FinishTurnQuery";
import FinishTurnUseCase from "./FinishTurnUseCase";

export default class FinishTurnSocketController extends SocketController<FinishTurnQuery> {
  protected async executeImpl(query: FinishTurnQuery) {
    if (!query.roomId) {
      return {
        success: false,
        message: "RoomId cannot be empty",
      };
    }

    query.username = this.user.username;

    const useCase = new FinishTurnUseCase();
    const result = await useCase.execute(query);

    if (result.isFailure) {
      return {
        success: false,
        message: "Unexpected error occured",
      };
    }

    this.emitToRoomAll(
      query.roomId,
      "game details change",
      result.value.gameDetails
    );
    this.emitToClient("game my state change", result.value.myState);

    if (result.value.finishReward) {
      this.emitToClient("game reward", result.value.finishReward);
      this.emitToRoom(query.roomId, "game player state change", result.value.myPublicState);
    }

    if (result.value.looser) {
      this.emitToRoomAll(query.roomId, "game looser", result.value.looser);
    }

    return {
      success: true,
    };
  }
}
