import { IAsyncUseCase, Result } from "@core/logic";
import { IPayload } from "@core/interfaces";
import { GameLogModel, IGameLogModel } from "@database";
import { getPagesCount } from "@utils/Global";
import { GetHistoryRequest, GetHistoryResponse } from "./GetHistoryModels";
import { IHistoryItem } from "../../models";

type UseCase = IAsyncUseCase<GetHistoryRequest, GetHistoryResponse>;
type ReturnType = Promise<Result<GetHistoryResponse>>;

export class GetHistoryUseCase implements UseCase {
  async execute(input: GetHistoryRequest, user: IPayload): ReturnType {
    const filter = { username: user.username };

    try {
      const logs: IGameLogModel[] = await GameLogModel.find(filter)
        .sort({ date: -1 })
        .skip((input.pageNumber - 1) * input.pageSize)
        .limit(input.pageSize);
      const totalItems = await GameLogModel.countDocuments(filter);

      return Result.ok({
        items: logs.map(this.toHistoryItem),
        currentPage: input.pageNumber,
        pagesCount: getPagesCount(totalItems, input.pageSize),
        totalResults: totalItems,
      });
    } catch (_err) {
      return Result.fail(_err);
    }
  }

  private toHistoryItem(log: IGameLogModel): IHistoryItem {
    return {
      date: log.date,
      place: log.place,
      playerCount: log.playerCount,
      reward: log.reward,
      roomId: log.roomId,
    };
  }
}
