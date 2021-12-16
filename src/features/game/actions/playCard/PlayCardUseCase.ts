import { IUseCase, Result } from "@core/logic";
import { PlayCardQuery } from "@features/game/models/PlayCardQuery";
import { PlayCardResult } from "@features/game/models/PlayCardResult";
import { GameModel, GameDocument, PlayerDocument, IGameModel } from "@database";
import GameUtils from "@utils/Game";

export default class PlayCardUseCase
  implements IUseCase<PlayCardQuery, PlayCardResult>
{
  async execute(request: PlayCardQuery): Promise<Result<PlayCardResult>> {
    const game: GameDocument = await GameModel.findOne({
      roomId: request.roomId,
      "players.username": request.username,
    });

    if (!game) {
      return Result.fail("Game not found");
    }

    const player: PlayerDocument = game.players.find(
      (item) => item.username === request.username
    ) as PlayerDocument;

    if (!player) {
      return Result.fail("Player not found");
    }

    this.updatePlayerHand(player, request);

    // TODO: check if cards are valid/existing
    game.playDeck.push(...request.cards);

    this.resetPlayDeckIfNeeded(game, request.cards);

    await game.save();

    return Result.ok({
      newGameDetailsState: GameUtils.toGameDetails(game),
      newMyState: GameUtils.toMyPlayerState(player),
      newPublicState: GameUtils.toPublicPlayerState(player)
    });
  }

  private updatePlayerHand(player: PlayerDocument, request: PlayCardQuery): void {
    const cardSet = new Set(player.handCards);
    request.cards.forEach((card) => cardSet.delete(card));
    player.handCards = Array.from(cardSet);
    player.lastMoves.push(...request.cards);
  }

  private resetPlayDeckIfNeeded(game: IGameModel, cardsPut: string[]) {
    if (game.rulesMode === "classic") {
      const found10Card = cardsPut.findIndex(card => !!(card && card.startsWith("10")));

      if (found10Card >= 0) {
        game.deadDeck.push(...game.playDeck);
        game.playDeck = [];
      }
    }
  }
}
