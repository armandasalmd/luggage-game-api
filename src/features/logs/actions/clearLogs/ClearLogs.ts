import { IAsyncUseCase, Result } from "@core/logic";
import { LogType, LogModel } from "@database";

type UseCase = IAsyncUseCase<LogType[], number>;
type ReturnType = Promise<Result<number>>;

export class ClearLogsUseCase implements UseCase {
  async execute(types: LogType[]): ReturnType {
    try {
      const { deletedCount } = await LogModel.remove({
        type: { $in: types},
      });
      
      return Result.ok(deletedCount);
    } catch {
      return Result.fail("Cannot clear log models");
    }
  }
}
