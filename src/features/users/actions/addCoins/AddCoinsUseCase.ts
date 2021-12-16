import { IUseCase, Result } from "@core/logic";
import { UserModel } from "@database";
import { AddCoinsQuery } from "@features/users/models/AddCoinsQuery";

export default class AddCoinsUseCase implements IUseCase<AddCoinsQuery, void> {
  async execute(query: AddCoinsQuery): Promise<Result<void>> {
    await UserModel.updateOne({
      username: query.username
    }, {
      "$inc": {
        coins: query.amount
      }
    });

    return Result.ok();
  }
}