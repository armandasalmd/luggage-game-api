import { SocketController } from "@core/socket";
import { FinishTurnUseCase } from "./FinishTurn";
import { FinishTurnResponse } from "./FinishTurnModels";

export class FinishTurnSocketController extends SocketController<void> {
  protected async executeImpl(): Promise<FinishTurnResponse> {
    const { gameId, username } = this.user;

    if (!gameId || !username) {
      return {
        success: false,
        message: "No identity, try refreshing the page",
      };
    }

    const useCase = new FinishTurnUseCase();
    const result = await useCase.execute({ gameId, username });

    if (result.isFailure) {
      return {
        success: false,
        message: result.error.message,
      };
    }

    // Socket events
    this.emitToRoomAll(gameId, "game details changed", result.value.gameDetails);
    
    // Optional if top luggage is taken
    if (result.value.myPublicState) {
      this.emitToRoom(gameId, "game public player changed", result.value.myPublicState);
    }

    // Optional if game has finished
    if (result.value.rewardsIfEnded) {
      this.emitToRoomAll(gameId, "game ended", result.value.rewardsIfEnded);
    }

    return { 
      success: true,
      myPlayerState: result.value.myState
    };
  }
}
