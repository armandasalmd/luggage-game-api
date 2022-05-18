import { EnvConfig } from "@core/config";
import { IPayload } from "@core/interfaces";
import { IAsyncUseCase, Result } from "@core/logic";
import RedisManager from "@databaseRedis";

type UseCase = IAsyncUseCase<void, void>;

export class ClearCacheUseCase implements UseCase {
  async execute(_: void, user: IPayload) {
    const env = new EnvConfig();

    if (env.isSuperAdmin(user.username)) {
      await RedisManager.instance.client.execute(["FLUSHDB"]);
      RedisManager.tryBuildIndexes();

      return Result.ok<void>();
    }

    return Result.fail<void>("Not authorized");
  }
}
