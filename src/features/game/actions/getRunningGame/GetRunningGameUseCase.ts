import { IUseCase, Result } from "@core/logic";
import { IGameModel, GameModel } from "@database";
import { GetRunningGameResponse } from "@features/game/models/GetRunningGameResponse";

export default class GetRunningGameUseCase
  implements IUseCase<string, GetRunningGameResponse>
{
  async execute(username: string): Promise<Result<GetRunningGameResponse>> {
    const game: IGameModel = await GameModel.findOne({
      "players.username": username,
      running: true
    }, { roomId: 1 }, { lean: true });

    return Result.ok({
      roomId: game.roomId,
      success: !!game
    });
  }
}
