import { IUseCase, Result } from "@core/logic";
import { UserModel, UserDocument } from "@database";

export class GetCoinsUseCase implements IUseCase<string, number> {
  async execute(email: string): Promise<Result<number>> {
    const user: UserDocument = await UserModel.findOne({ email }).exec();

    return Result.ok<number>(user.coins);
  }
}
