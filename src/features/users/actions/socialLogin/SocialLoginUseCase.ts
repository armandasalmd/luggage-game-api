import { IUseCase, Result } from "@core/logic";
import { UserDocument, UserModel, IUserModel } from "@database";
import { SocialLoginQuery } from "@features/users/models/SocialLoginQuery";
import SocialLoginResult from "@features/users/models/SocialLoginResult";
import { getPayload } from "@utils/User";

export default class SocialLoginUseCase implements IUseCase<SocialLoginQuery, SocialLoginResult> {
  public async execute(request: SocialLoginQuery): Promise<Result<SocialLoginResult>> {
    let user: UserDocument = await UserModel.findOne({
      email: request.email,
    });

    if (user && !user.authStrategies.includes(request.provider)) {
      user.authStrategies.push(request.provider);

      if (!user.avatar && request.avatarUrl) {
        user.avatar = request.avatarUrl;
      }

      await user.save();
    } else if (!user) {
      const newUserProps: Partial<IUserModel> = {
        email: request.email,
        firstname: request.firstname,
        lastname: request.lastname,
        authStrategies: [request.provider],
        coins: 10000,
        username: this.makeUsername(request.email),
      };

      if (request.avatarUrl !== undefined) {
        newUserProps.avatar = request.avatarUrl;
      }

      user = new UserModel(newUserProps);
      await user.save();
    }

    const result: SocialLoginResult = {
      userPayload: getPayload(user),
    };

    return Result.ok(result);
  }

  private makeUsername(email: string): string {
    const atIdx = email.indexOf("@");

    return email.substring(0, atIdx);
  }
}