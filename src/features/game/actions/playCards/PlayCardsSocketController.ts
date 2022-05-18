import { SocketController } from "@core/socket";
import { PlayCardsQuery, PlayCardsRequest, PlayCardsResponse } from "./PlayCardsModels";
import { PlayCardsUseCase } from "./PlayCards";

export class PlayCardsSocketController extends SocketController<PlayCardsRequest> {
  protected async executeImpl(request: PlayCardsRequest): Promise<PlayCardsResponse> {
    const { gameId, username } = this.user;

    if (!gameId || !username) {
      return {
        success: false,
        message: "Game not found",
      };
    }

    if (!Array.isArray(request.cards) || request.cards.length <= 0) {
      return {
        success: false,
        message: "Cards cannot be empty",
      };
    }

    const useCase = new PlayCardsUseCase();
    const query: PlayCardsQuery = {
      gameId,
      username,
      cards: request.cards,
    };
    const result = await useCase.execute(query);

    if (result.isFailure) {
      return {
        success: false,
        message: result.error.message,
      };
    }

    this.emitToRoom(gameId, "game player pushed cards", result.value);

    if (result.value.takeLuggageResult) {
      this.emitToRoom(gameId, "game luggage taken", result.value.takeLuggageResult);
      this.emitToRoom(gameId, "game emoji", {
        sender: username,
        emojiId: "club-450439",
      });
    }

    return {
      success: true,
      myPlayerState: result.value.myPlayerState,
    };
  }
}
