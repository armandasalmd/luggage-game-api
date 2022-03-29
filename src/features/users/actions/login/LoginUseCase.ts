import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { PassportConfig } from "@core/config";
import { IHttpError } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import { UserModel, UserDocument, LogType } from "@database";
import { LoginRequest } from "@features/users/models/LoginRequest";
import { LoginResponse } from "@features/users/models/LoginResponse";
import { getPayload } from "@utils/User";
import { CoinsAndRewardsResponse } from "@features/users/models/CoinsAndRewardsResponse";
import { getDailyRewards } from "@utils/Reward";
import PushLogUseCase from "@features/logs/actions/PushLogUseCase";

export class LoginUseCase implements IUseCase<LoginRequest, LoginResponse> {
  private passportConfig: PassportConfig;
  private readonly incorrectDetailsError: IHttpError;
  private readonly passwordNotSetError: IHttpError;

  constructor() {
    this.passportConfig = new PassportConfig();
    
    this.incorrectDetailsError = {
      statusCode: 400,
      message: "Incorrect details",
    };

    this.passwordNotSetError = {
      statusCode: 400,
      message: "Password not set. Use Google or Facebook login",
    };
  }

  async execute(request: LoginRequest): Promise<Result<LoginResponse>> {
    const user: UserDocument = await UserModel.findOne({
      username: request.username,
    }).exec();

    if (!user) {
      return Result.fail(this.incorrectDetailsError);
    }

    if (!user.password) {
      return Result.fail(this.passwordNotSetError);
    }

    const isMatch = await bcrypt.compare(request.password, user.password);

    if (!isMatch) {
      return Result.fail(this.incorrectDetailsError);
    }

    const token = jwt.sign(getPayload(user), this.passportConfig.secret, {
      expiresIn: this.passportConfig.expiresIn,
    });

    const meta: CoinsAndRewardsResponse = {
      coins: user.coins,
      rewards: getDailyRewards(user.dailyReward),
    };

    new PushLogUseCase().execute({
      message: `${user.username} logged in`,
      username: user.username,
      type: LogType.Login,
    });

    return Result.ok<LoginResponse>({
      success: true,
      token: "Bearer " + token,
      ...meta
    });
  }
}

export default LoginUseCase;
