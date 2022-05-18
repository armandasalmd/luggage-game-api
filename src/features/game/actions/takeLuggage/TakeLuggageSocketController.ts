import { SocketController } from "@core/socket";
import { BaseEngine } from "@features/game/engine/BaseEngine";
import { TakeLuggageRequest, TakeLuggageQuery } from "./TakeLuggageModels";
import { TakeLuggageUseCase } from "./TakeLuggage";
import { ISuccessResult } from "@core/interfaces";

export class TakeLuggageSocketController extends SocketController<TakeLuggageRequest> {
  protected async executeImpl(input: TakeLuggageRequest): Promise<ISuccessResult> {
    if (!BaseEngine.isValid(input.luggageCard)) {
      return {
        success: false,
        message: "Invalid luggage card",
      };
    }

    const { gameId, username } = this.user;
    if (!gameId || !username) {
      return {
        success: false,
        message: "Session expired",
      };
    }

    const query: TakeLuggageQuery = {
      luggageCards: [input.luggageCard],
      gameId,
      username,
    };
    const useCase = new TakeLuggageUseCase();
    const result = await useCase.execute(query);

    // Notify other game players
    this.emitToRoom(gameId, "game luggage taken", result.value);
    this.emitToRoom(gameId, "game emoji", {
      sender: username,
      emojiId: "club-450439",
    });

    return {
      success: result.isSuccess,
    };
  }
}
