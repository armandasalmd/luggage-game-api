import { IAsyncUseCase, Result } from "@core/logic";
import { LogType, LobbyModel } from "@database";
import { GameModel, getRepositories, PlayerModel } from "@databaseRedis";
import PushLogUseCase from "@features/logs/actions/PushLogUseCase";
import AddCoinsUseCase from "@features/users/actions/addCoins/AddCoinsUseCase";
import { Deck } from "@utils/Deck";
import GameUtils from "@utils/Game";
import { FinishTurnQuery, FinishTurnResult } from "./FinishTurnModels";
import { CreateHistoryUseCase } from "../createHistory";
import { IGameRewards, IPlayerReward } from "../surrender";

type UseCase = IAsyncUseCase<FinishTurnQuery, FinishTurnResult>;
type ReturnType = Promise<Result<FinishTurnResult>>;

export class FinishTurnUseCase implements UseCase {
  async execute(input: FinishTurnQuery): ReturnType {
    const { gameRepository, playerRepository } = getRepositories();

    const game = await gameRepository.fetch(input.gameId);
    if (!game.activeSeatId) return Result.fail("Game not found");

    const player = await game.getActivePlayer();
    if (player.username !== input.username)
      return Result.fail("Only active player can finish turn");

    try {
      this.nextSeatId(game);
      const didTakeHome = this.checkIfTakeHomeAndClearSubmit(game, player);
      this.tryDrawCards(game, player);
      await this.playerWonRoutine(game, player);

      await gameRepository.save(game);
      await playerRepository.save(player);

      return Result.ok({
        gameDetails: GameUtils.toGameDetails(game, false),
        myState: GameUtils.toMyPlayerState(player),
        rewardsIfEnded: await this.gameFinishedRoutine(game),
        myPublicState: {
          username: player.username,
          handCardCount: player.handCards.length,
          seatId: player.seatId,
          didTakeHome
        }
      });
    } catch (error) {
      new PushLogUseCase().execute({
        message: input.gameId + ". " + error.message,
        type: LogType.DatabaseException,
        username: input.username,
      });

      return Result.fail("Unexpected error");
    }
  }

  private async addCoins(amount: number, username: string) {
    const useCase = new AddCoinsUseCase();
    await useCase.execute({ amount, username });
  }

  private checkIfTakeHomeAndClearSubmit(game: GameModel, player: PlayerModel): boolean {
    const didTakeHome = player.submitQueue.length === 0 && game.playDeck.length !== 0;

    if (didTakeHome) {
      player.handCards.push(...game.playDeck);
      game.playDeck = [];
    } 

    player.submitQueue = [];

    return didTakeHome;
  }

  private async gameFinishedRoutine(game: GameModel): Promise<IGameRewards | undefined> {
    const seatsDone = game.playersDone;

    if (game.players.length - seatsDone.length <= 1) {
      // Update lobby state
      await LobbyModel.updateOne(
        {
          roomCode: game.lobbyId,
          state: "gameStarted",
        },
        {
          $set: { state: "gameFinished" },
        }
      );

      // Deduct coins for last player
      const looserSeatId = [1, 2, 3, 4, 5].find((o) => !seatsDone.includes(o));
      const looserUsername = game.players[looserSeatId];
      await this.addCoins(-game.gamePrice, looserUsername);

      // Create history
      const players = await game.getAllPlayers();
      const useCase = new CreateHistoryUseCase();
      useCase.execute(GameUtils.toFullGame(game, players));

      // Remove game cache
      this.removeGameCache(game, players);

      return {
        gameId: game.entityId,
        looser: this.getPlayerReward(game, players.find(o => o.seatId === looserSeatId), true),
        winners: players.filter(o => o.seatId !== looserSeatId).map(o => this.getPlayerReward(game, o, false)),
      };
    }
  }

  private getPlayerReward(game: GameModel, player: PlayerModel, looser: boolean): IPlayerReward {
    const dict = ["1st", "2nd", "3rd", "4th", "5th"];
    const place = looser ? game.players.length : dict.indexOf(player.status) + 1;
    
    return {
      username: player.username,
      reward: GameUtils.getReward(game.gamePrice, game.players.length, place),
    };
  }

  private nextSeatId(game: GameModel) {
    const SEATS = [1, 2, 3, 4, 5].slice(0, game.players.length);
    const seatsDone = game.playersDone;
    const remaining = SEATS.filter((o) => !seatsDone.includes(o));
    const activeIdx = remaining.indexOf(game.activeSeatId);

    remaining.push(remaining[0]); // resolve boundaries error
    game.activeSeatId = remaining[activeIdx + 1];
  }

  private async playerWonRoutine(game: GameModel, player: PlayerModel) {
    if (player.luggageCards === ",,,,," && player.handCards.length === 0) {
      const place = game.playersDone.length + 1;
      const reward = GameUtils.getReward(game.gamePrice, game.players.length, place);

      player.status = GameUtils.getPlayerPlace(place);
      game.seatsDone += !game.seatsDone ? player.seatId : "," + player.seatId;

      await this.addCoins(reward, player.username);
    }
  }

  private async removeGameCache(game: GameModel, players: PlayerModel[]) {
    const { gameRepository, playerRepository } = getRepositories();

    await Promise.all([
      gameRepository.remove(game.entityId),
      ...players.map((o) => playerRepository.remove(o.entityId)),
    ]).catch((error) => console.log(error.meesage));
  }

  private tryDrawCards(game: GameModel, player: PlayerModel) {
    if (player.handCards.length < 3) {
      const sourceDeck = new Deck([...game.sourceDeck]);

      player.handCards.push(...sourceDeck.take(3 - player.handCards.length));
      game.sourceDeck = sourceDeck.cards;
    }
  }
}
