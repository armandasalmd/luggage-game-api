import { IUseCase, Result } from "@core/logic";
import {
  GameDocument,
  GameModel,
  LobbyModel,
  LobbyDocument,
  UserDocument,
  UserModel,
  IPlayerModel,
} from "@database";
import { GameFinishedRewards, PlayerReward } from "@features/game/models/GameFinishedRewards";
import GameUtils from "@utils/Game";
import AddCoinsUseCase from "@features/users/actions/addCoins/AddCoinsUseCase";

export default class SurrenderUseCase implements IUseCase<string, GameFinishedRewards> {
  async execute(username: string): Promise<Result<GameFinishedRewards>> {
    const game: GameDocument = await GameModel.findOne({
      "players.username": username,
      running: true,
    });

    if (!game) return Result.fail("Game not found");

    const lobby: LobbyDocument = await LobbyModel.findOne({
      roomCode: game.roomId,
      state: "gameStarted",
    });

    if (!lobby) return Result.fail("Lobby not found");

    lobby.state = "gameFinished";
    lobby.save();

    game.running = false;
    game.activeSeatId = 0;
    game.save();

    if (!(await this.addPlayerCoins(username, -lobby.gamePrice))) {
      return Result.fail("Cannot charge player " + username);
    }

    const availableReward = lobby.gamePrice * 0.95;
    const winReward = Math.round(availableReward / (lobby.playerCount - 1));

    if (!(await this.rewardPlayers(game, winReward))) {
      return Result.fail("Cannot reward players");
    }

    return Result.ok({
      looseAmount: lobby.gamePrice,
      looserUsername: username,
      winners: this.getPlayerRewards(game.players, winReward),
      roomId: game.roomId,
      gameDetails: GameUtils.toGameDetails(game),
    });
  }

  private getPlayerRewards(players: IPlayerModel[], amount: number): PlayerReward[] {
    return players.map((item) => {
      return {
        reward: amount,
        username: item.username,
      };
    });
  }

  private async addPlayerCoins(username: string, amount: number): Promise<boolean> {
    const addCoins = new AddCoinsUseCase();

    await addCoins.execute({
      amount,
      username,
    });

    return true;
  }

  private async rewardPlayers(game: GameDocument, reward: number): Promise<boolean> {
    let success = true;

    for (const player of game.players) {
      if (!(await this.addPlayerCoins(player.username, reward))) {
        success = false;
      }
    }

    return success;
  }
}
