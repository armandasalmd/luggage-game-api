import { IAsyncUseCase, Result } from "@core/logic";
import { TakeLuggageQuery, TakeLuggageResult } from "./TakeLuggageModels";
import { getRepositories } from "@databaseRedis";
import { Deck } from "@utils/Deck";

type UseCase = IAsyncUseCase<TakeLuggageQuery, TakeLuggageResult>;
type ResultType = Promise<Result<TakeLuggageResult>>;

export class TakeLuggageUseCase implements UseCase {
  async execute(input: TakeLuggageQuery): ResultType {
    const { gameRepository, playerRepository } = getRepositories();

    const game = await gameRepository.fetch(input.gameId);
    if (!game.gameRules) return Result.fail("Game not found");

    const player = await game.getActivePlayer();
    if (player.username !== input.username) return Result.fail("Please wait for your turn");

    if (game.sourceDeck.length !== 0 || player.handCards.length !== 0)
      return Result.fail("Can't take luggage yet");

    const luggageDeck = Deck.fromString(player.luggageCards);

    if (!input.luggageCards.every((o) => this.cardExists(luggageDeck, o))) {
      return Result.fail("You don't have all luggage cards");
    }

    player.luggageCards = this.filterDeck(luggageDeck, input.luggageCards).join(",");
    player.handCards = [...input.luggageCards];

    try {
      await Promise.all([gameRepository.save(game), playerRepository.save(player)]);
    } catch {
      return Result.fail("Unexpected error");
    }

    return Result.ok({
      newLuggage: player.luggageCards,
      seatId: player.seatId,
    });
  }

  private cardExists(deck: Deck, card: string): boolean {
    return !!deck.cards.find((o) => o === card);
  }

  private filterDeck(deck: Deck, cards: string[]): string[] {
    return deck.cards.map((o) => (cards.includes(o) ? "" : o));
  }
}
