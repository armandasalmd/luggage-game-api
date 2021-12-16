import { IUseCase, Result } from "@core/logic";
import { TakeLuggageQuery } from "@features/game/models/TakeLuggageQuery";
import { GameDocument, GameModel, PlayerDocument } from "@database";
import { Deck } from "@utils/Deck";
import GameUtils from "@utils/Game";
import { TakeLuggageResult } from "@features/game/models/TakeLuggageResult";

export default class TakeLuggageUseCase
  implements IUseCase<TakeLuggageQuery, TakeLuggageResult>
{
  async execute(query: TakeLuggageQuery): Promise<Result<TakeLuggageResult>> {
    const game: GameDocument = await GameModel.findOne({
      roomId: query.roomId,
      running: true,
      "players.username": query.username,
    });

    if (!game) return Result.fail("Game not found");

    const player: PlayerDocument = game.players.find(
      (item) => item.username === query.username
    ) as PlayerDocument;

    if (!player) return Result.fail("Player not found");

    if (!(game.sourceDeck.length === 0 && player.handCards.length === 0)) {
      return Result.fail("Cannot play luggage cards yet");
    }

    const luggageDeck = Deck.fromString(player.luggageCards);
    const error = this.isCardValidToPlay(luggageDeck, query.luggageCard);

    if (error) return Result.fail(error);

    player.luggageCards = this.removeFromDeck(luggageDeck, query.luggageCard);
    player.handCards.push(query.luggageCard);

    await game.save();

    return Result.ok({
      newMyState: GameUtils.toMyPlayerState(player),
      newPublicState: GameUtils.toPublicPlayerState(player)
    });
  }

  private isCardValidToPlay(luggage: Deck, card: string): string | null {
    const luggageIdx = luggage.cards.findIndex((item) => item === card);

    if (luggageIdx < 0) return "Provided luggage card does not exist";

    if (luggageIdx < 3) {
      const upCards = luggage.cards.slice(3);
      const containsUpCards = !upCards.every((item) => item === "");

      if (containsUpCards) return "Cannot play down facing cards yet";
    }

    return null;
  }

  private removeFromDeck(deck: Deck, card: string): string {
    return deck.toString().replace(card, "");
  }
}
