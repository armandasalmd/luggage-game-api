import { IUseCase, Result } from "@core/logic";
import { EnvConfig } from "@core/config";
import { LogModel, ILogModel, LogType } from "@database";
import { PushLogQuery } from "../models/PushLogQuery";

class PushLogUseCase implements IUseCase<PushLogQuery, void> {
  async execute(request: PushLogQuery): Promise<Result<void>> {
    const log: ILogModel = {
      dateCreated: new Date(),
      message: request.message,
      type: request.type || LogType.None,
      username: request.username,
    };

    if (request.type === LogType.Login) {
      const env = new EnvConfig();
      if (env.isDevelopment) return Result.ok();
    }

    try {
      await LogModel.create(log);
      return Result.ok();
    } catch {
      return Result.fail("Failed to push log");
    }
  }
}

export default PushLogUseCase;
