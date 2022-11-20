import { IAsyncUseCase, Result } from "@core/logic";
import { getGameRepository } from "@databaseRedis";
import { GetRunningGameIdResponse } from "./GetRunningGameIdModels";

type UseCase = IAsyncUseCase<string, GetRunningGameIdResponse>;
type ReturnType = Promise<Result<GetRunningGameIdResponse>>;

export class GetRunningGameIdUseCase implements UseCase {
  async execute(username: string): ReturnType {
    const gameRepository = getGameRepository();

    try {
      const game = await gameRepository.search().where("players").contain(username).return.first();

      return Result.ok({
        gameId: game?.entityId,
        lobbyId: game?.lobbyId,
        success: !!game,
      });
    } catch (e) {
      return Result.ok({
        success: false,
        message: e.message,
      });
    }
  }
}
