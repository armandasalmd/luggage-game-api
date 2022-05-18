import { IAsyncUseCase, Result } from "@core/logic";
import { GameLogModel, IGameLogModel } from "@database";
import GameUtils from "@utils/Game";
import { IFullGameModel, IPlayerHistory } from "../../models";

type UseCase = IAsyncUseCase<IFullGameModel, unknown>;

export class CreateHistoryUseCase implements UseCase {
  async execute(input: IFullGameModel) {
    if (!input || !input.players) return Result.fail("Cannot save game history");

    const isSurrendered =
      input.players.findIndex((o) => o.status === GameUtils.PlayerState.Surrendered) !== -1;
    const base: Partial<IPlayerHistory> = {
      gamePrice: input.gamePrice,
      gameStartDate: new Date(),
      gameId: input.gameId,
      isSurrendered,
      playerCount: input.players.length,
    };

    const logs: IGameLogModel[] = [];
    for (const player of input.players) {
      logs.push(
        this.toHistoryItem({
          ...(base as IPlayerHistory),
          username: player.username,
          place: player.status,
        })
      );
    }
    await GameLogModel.insertMany(logs);

    return Result.ok();
  }

  private toHistoryItem(history: IPlayerHistory): IGameLogModel {
    if (history.place === GameUtils.PlayerState.Playing) {
      history.place = GameUtils.getPlayerPlace(history.playerCount);
    }

    let reward = 0;
    if (history.isSurrendered) {
      reward =
        history.place === GameUtils.PlayerState.Surrendered
          ? -history.gamePrice
          : GameUtils.getSurrenderReward(history.gamePrice, history.playerCount);
    } else {
      let placeNum =
        typeof history.place === "string"
          ? // tslint:disable-next-line: radix
            parseInt(history.place[0])
          : NaN;
      if (isNaN(placeNum)) placeNum = history.playerCount;
      reward = GameUtils.getReward(history.gamePrice, history.playerCount, placeNum);
    }

    return {
      date: history.gameStartDate,
      place: history.isSurrendered ? "Surrender" : history.place,
      playerCount: history.playerCount,
      reward: reward === 0 || isNaN(reward) ? -history.gamePrice : reward,
      roomId: history.gameId,
      username: history.username,
    };
  }
}
