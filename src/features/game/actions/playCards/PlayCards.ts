import { IAsyncUseCase, Result } from "@core/logic";
import { LogType } from "@database";
import { getRepositories, PlayerModel, GameModel } from "@databaseRedis";
import PushLogUseCase from "@features/logs/actions/PushLogUseCase";
import { PlayCardsQuery, PlayCardsResult } from "./PlayCardsModels";
import { getEngine } from "../../engine";
import GameUtils from "@utils/Game";

type UseCase = IAsyncUseCase<PlayCardsQuery, PlayCardsResult>;

export class PlayCardsUseCase implements UseCase {
  async execute(input: PlayCardsQuery): Promise<Result<PlayCardsResult>> {
    const { gameRepository, playerRepository } = getRepositories();

    const [game, player] = await Promise.all([
      gameRepository.fetch(input.gameId),
      playerRepository
        .search()
        .where("username")
        .equals(input.username)
        .and("gameId")
        .equals(input.gameId)
        .first(),
    ]);

    if (!game.activeSeatId) return Result.fail("Game not found");
    if (!player.gameId) return Result.fail("Player not found");
    if (player.seatId !== game.activeSeatId) return Result.fail("Please wait for your turn");

    const hasAll = input.cards.every((o) => player.handCards.includes(o));
    if (!hasAll) return Result.fail("You don't have all cards");

    // Post validation, engine part, database changes
    const engine = getEngine(game.gameRules);

    if (!engine.canPlayCards(game.playDeck, player.submitQueue, input.cards)) {
      return Result.fail("You can't play these cards");
    }

    const shouldDestroy = engine.shouldDestroy(player.submitQueue, input.cards);

    player.handCards = [...player.handCards.filter((o) => !input.cards.includes(o))];
    player.submitQueue.push(...input.cards);
    game.playDeck.push(...input.cards);

    if (shouldDestroy) {
      game.deadCardsCount += game.playDeck.length;
      game.playDeck = [];
    }

    const newLuggage = this.takeUpLuggage(game, player);

    // Saving to database
    try {
      await Promise.all([gameRepository.save(game), playerRepository.save(player)]);
    } catch (error) {
      new PushLogUseCase().execute({
        message: error.message,
        type: LogType.DatabaseException,
        username: input.username,
      });

      return Result.fail("Game state update failed");
    }

    const result: PlayCardsResult = {
      cards: input.cards,
      seatId: player.seatId,
      myPlayerState: GameUtils.toMyPlayerState(player),
    };

    if (newLuggage) {
      result.takeLuggageResult = {
        newLuggage,
        seatId: player.seatId,
      };
    }

    return Result.ok(result);
  }

  private takeUpLuggage(game: GameModel, player: PlayerModel): string | undefined {
    if (
      game.sourceDeck.length === 0 &&
      player.handCards.length === 0 &&
      !player.luggageCards.endsWith(",,,")
    ) {
      const luggage = player.luggageCards.split(",");

      player.handCards = luggage.splice(3);
      player.luggageCards = luggage.splice(0, 3).join(",") + ",,,";

      return player.luggageCards;
    }
  }
}
