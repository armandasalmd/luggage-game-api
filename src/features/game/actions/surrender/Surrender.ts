import { IAsyncUseCase, Result } from "@core/logic";
import { LobbyModel, LogType } from "@database";
import { GameModel, PlayerModel, getRepositories } from "@databaseRedis";
import PushLogUseCase from "@features/logs/actions/PushLogUseCase";
import GameUtils, { PlayerState } from "@utils/Game";
import { SurrenderQuery, IGameRewards, IPlayerReward } from "./SurrenderModels";
import { CreateHistoryUseCase } from "../createHistory";
import AddCoinsUseCase from "@features/users/actions/addCoins/AddCoinsUseCase";

type UseCase = IAsyncUseCase<SurrenderQuery, IGameRewards>;
type ReturnType = Promise<Result<IGameRewards>>;

export class SurrenderUseCase implements UseCase {
  async execute(input: SurrenderQuery): ReturnType {
    const { gameRepository, playerRepository } = getRepositories();
    const game = await gameRepository.fetch(input.gameId);

    if (!game.activeSeatId) return Result.fail("Game not found");
    if (!game.players.includes(input.username)) return Result.fail("Player not found");

    try {
      // Preparation
      const players = await game.getAllPlayers();
      const surrenderer = players.find((o) => o.username === input.username);
      surrenderer.status = PlayerState.Surrendered;

      const looserCoins: IPlayerReward = {
        username: input.username,
        reward: -game.gamePrice,
        playerState: PlayerState.Surrendered,
      };
      const winReward = GameUtils.getSurrenderReward(game.gamePrice, game.players.length);
      const winners: IPlayerReward[] = players
        .filter((o) => o.username !== input.username)
        .map((o) => ({
          reward: winReward,
          username: o.username,
        }));

      // Execute I/O stage
      await this.createHistory(game, players);

      const lobbyPromise = LobbyModel.updateOne(
        {
          roomCode: game.lobbyId,
          state: "gameStarted",
        },
        {
          $set: {
            state: "gameFinished",
          },
        }
      );

      await Promise.all([
        ...players.map((o) => playerRepository.remove(o.entityId)),
        gameRepository.remove(input.gameId),
        lobbyPromise,
        this.addCoins(looserCoins),
        ...winners.map((o) => this.addCoins(o)),
      ]);

      return Result.ok({
        gameId: input.gameId,
        looser: looserCoins,
        winners,
      });
    } catch (error) {
      new PushLogUseCase().execute({
        message: "Surrender failed for gameId: " + input.gameId + "." + error.message,
        type: LogType.DatabaseException,
        username: input.username,
      });
      console.log(error.message);

      return Result.fail("Unexpected error");
    }
  }

  private async addCoins(data: IPlayerReward) {
    const addCoins = new AddCoinsUseCase();
    await addCoins.execute({
      username: data.username,
      amount: data.reward,
    });
  }

  private async createHistory(game: GameModel, players: PlayerModel[]): Promise<void> {
    const useCase = new CreateHistoryUseCase();
    await useCase.execute(GameUtils.toFullGame(game, players));
  }
}
