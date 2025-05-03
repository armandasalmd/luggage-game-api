import { IAsyncUseCase, Result } from "@core/logic";
import { DisconnectQuery } from "./DisconnectModels"; 
import { getPlayerRepository } from "@databaseRedis";

type UseCase = IAsyncUseCase<DisconnectQuery, number>;
type ReturnType = Promise<Result<number>>;

export class DisconnectUseCase implements UseCase {
  async execute(data: DisconnectQuery): ReturnType {
    const playerRepository = getPlayerRepository();
    const player = await playerRepository.search()
      .where("username").equals(data.username)
      .and("gameId").equals(data.gameId).first();

    if (player.entityId) {
      player.connected = data.connected;
      await playerRepository.save(player);

      return Result.ok(player.seatId);
    }

    return Result.fail("Player cannot be disconnected: not found");
  }
}