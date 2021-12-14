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
import {
  GameFinishedRewards,
  PlayerReward,
} from "@features/game/models/GameFinishedRewards";

export default class SurrenderUseCase
  implements IUseCase<string, GameFinishedRewards>
{
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
    });
  }

  private getPlayerRewards(
    players: IPlayerModel[],
    amount: number
  ): PlayerReward[] {
    return players.map((item) => {
      return {
        reward: amount,
        username: item.username,
      };
    });
  }

  private async addPlayerCoins(
    username: string,
    amount: number
  ): Promise<boolean> {
    const user: UserDocument = await UserModel.findOne({
      username,
    });

    if (user) {
      user.coins = user.coins - amount;
      await user.save();
    }

    return !!user;
  }

  private async rewardPlayers(
    game: GameDocument,
    reward: number
  ): Promise<boolean> {
    let success = true;

    for (const player of game.players) {
      if (!(await this.addPlayerCoins(player.username, reward))) {
        success = false;
      }
    }

    return success;
  }
}
