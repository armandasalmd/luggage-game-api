import { IUseCase, Result } from "@core/logic";
import { GameModel, IGameModel } from "@database";

export default class GetGameRoomIdUseCase implements IUseCase<string, string> {
  async execute(username: string): Promise<Result<string>> {
    if (!username) return Result.ok(undefined);
    
    const game: IGameModel = await GameModel.findOne({
      "players.username": username,
      running: true,
    });

    return Result.ok(game ? game.roomId : undefined);
  }
}