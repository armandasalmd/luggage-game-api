import { IAsyncUseCase, Result } from "@core/logic";
import { GameModel, PlayerModel, getGameRepository } from "@databaseRedis";
import GameUtils from "@utils/Game";
import { GetGameStateQuery, GetGameStateResult } from "./GetGameStateModels";

type UseCase = IAsyncUseCase<GetGameStateQuery, Partial<GetGameStateResult>>;

export class GetGameStateUseCase implements UseCase {
  async execute(input: GetGameStateQuery): Promise<Result<GetGameStateResult>> {
    const gameRepository = getGameRepository();
    const game: GameModel = await gameRepository.fetch(input.gameId);

    if (!game.activeSeatId) {
      return Result.fail("Game not found");
    }

    // TODO: refactor, fetching 2 times is not optimal
    // Attempt to join Game and Player models somehow
    const allPlayers = await game.getAllPlayers();
    const reqPlayer = allPlayers.find((o) => o.username === input.username);

    if (!reqPlayer) {
      return Result.fail("Player is not in requested game");
    }

    if (!reqPlayer) return Result.fail("Cannot create my player state");

    const output: GetGameStateResult = {
      myState: GameUtils.toMyPlayerState(reqPlayer),
      gameDetails: GameUtils.toGameDetails(game, true),
      playersState: this.createPublicPlayerState(allPlayers, reqPlayer),
    };

    return Result.ok(output);
  }

  private createPublicPlayerState(players: PlayerModel[], exclude: PlayerModel) {
    return players.filter((o) => o !== exclude).map(GameUtils.toPublicPlayerState);
  }
}
