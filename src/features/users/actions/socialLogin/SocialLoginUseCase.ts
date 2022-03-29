import { IUseCase, Result } from "@core/logic";
import { UserDocument, UserModel, IUserModel, LogType } from "@database";
import PushLogUseCase from "../../../logs/actions/PushLogUseCase";
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
      const username = await this.makeUsernameAsync(request.email);

      if (!username) {
        return Result.fail("Cannot allocate a username");
      }

      const newUserProps: Partial<IUserModel> = {
        email: request.email,
        firstname: request.firstname,
        lastname: request.lastname,
        authStrategies: [request.provider],
        coins: 10000,
        username,
      };

      if (request.avatarUrl !== undefined) {
        newUserProps.avatar = request.avatarUrl;
      }

      user = new UserModel(newUserProps);
      await user.save();
    }

    new PushLogUseCase().execute({
      message: `${user.username} logged in (${request.provider})`,
      username: user.username,
      type: LogType.Login
    });

    const result: SocialLoginResult = {
      userPayload: getPayload(user),
    };

    return Result.ok(result);
  }

  /**
   * Function creates a username from email and adds number
   * in the end if duplicate username was found
   */
  private async makeUsernameAsync(email: string): Promise<string> {
    const baseName = email.substring(0, email.indexOf("@"));
    let username = baseName;

    for (let i = 1; i < 20; i++) {
      if (!await UserModel.exists({username})) {
        return username;
      }

      username = baseName + i.toString();
    }

    return "";
  }
}
