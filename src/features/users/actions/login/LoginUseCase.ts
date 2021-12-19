import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { PassportConfig } from "@core/config";
import { IHttpError } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import { UserModel, UserDocument } from "@database";
import { LoginRequest } from "@features/users/models/LoginRequest";
import { LoginResponse } from "@features/users/models/LoginResponse";
import { getPayload } from "@utils/User";

export class LoginUseCase implements IUseCase<LoginRequest, LoginResponse> {
  private passportConfig: PassportConfig;
  private readonly incorrectDetailsError: IHttpError;

  constructor() {
    this.passportConfig = new PassportConfig();
    this.incorrectDetailsError = {
      statusCode: 400,
      message: "Incorrect details",
    };
  }

  async execute(request: LoginRequest): Promise<Result<LoginResponse>> {
    const user: UserDocument = await UserModel.findOne({
      username: request.username,
    }).exec();

    if (!user) {
      return Result.fail(this.incorrectDetailsError);
    }

    const isMatch = await bcrypt.compare(request.password, user.password);

    if (!isMatch) {
      return Result.fail(this.incorrectDetailsError);
    }

    const token = jwt.sign(getPayload(user), this.passportConfig.secret, {
      expiresIn: this.passportConfig.expiresIn,
    });

    return Result.ok<LoginResponse>({
      success: true,
      token: "Bearer " + token,
      coins: user.coins
    });
  }
}

export default LoginUseCase;
