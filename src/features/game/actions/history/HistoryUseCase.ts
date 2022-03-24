import { IPayload } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import { HistoryRequest } from "@features/game/models/HistoryRequest";
import { HistoryResponse } from "@features/game/models/HistoryResponse";
import { GameModel } from "@database";
import { IHistoryItem } from "@features/game/models/IHistoryItem";
import GameUtils from "@utils/Game";
import { getPagesCount } from "@utils/Global";

interface IAggregatedPlayerHistory {
  place: string;
  roomId: string;
  gamePrice: number;
  playerCount: number;
  gameStartDate: Date;
}

export default class HistoryUseCase implements IUseCase<HistoryRequest, HistoryResponse> {
  async execute(request: HistoryRequest, user: IPayload): Promise<Result<HistoryResponse>> {
    const filter = { running: false, "players.username": user.username };

    let games: IAggregatedPlayerHistory[] = await GameModel.aggregate([
      { $match: filter },
      { $skip: (request.pageNumber - 1) * request.pageSize },
      { $limit: request.pageSize },
      {
        $addFields: {
          playerCount: { $size: "$players" },
          thisPlayer: {
            $filter: {
              input: "$players",
              as: "p",
              cond: { $eq: ["$$player.username", user.username] }
            }
          }
        },
      },
      { $unwind: { path: "$thisPlayer" } },
      { $addFields: { place: "$thisPlayer.playerState" } },
      {
        $project: {
          gamePrice: 1,
          roomId: 1,
          gameStartDate: 1,
          playerCount: 1,
          place: 1
        }
      },
      { $sort: { gameStartDate: -1 } }
    ]);

    if (!games) games = [];

    const totalItems = await GameModel.countDocuments(filter);

    return Result.ok({
      items: games.map(this.toHistoryItem),
      currentPage: request.pageNumber,
      pagesCount: getPagesCount(totalItems, request.pageSize),
      totalResults: games.length
    });
  }

  private toHistoryItem(history: IAggregatedPlayerHistory): IHistoryItem {
    if (history.place === GameUtils.PlayerState.Playing) {
      history.place = GameUtils.getPlayerPlace(history.playerCount);
    }

    let placeNum = parseInt(history.place[0]);
    if (isNaN(placeNum)) placeNum = history.playerCount;

    const reward = GameUtils.getReward(history.gamePrice, history.playerCount, placeNum);

    return {
      date: history.gameStartDate,
      place: history.place,
      playerCount: history.playerCount,
      reward: reward,
      roomId: history.roomId
    };
  }
}