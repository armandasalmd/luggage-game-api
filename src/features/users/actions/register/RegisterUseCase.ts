import bcrypt from "bcryptjs";

import { IUseCase, Result } from "@core/logic";
import { UserModel, UserDocument, IUserModel } from "@database";
import { RegisterRequest } from "@features/users/models/RegisterRequest";
import { RegisterResponse } from "@features/users/models/RegisterResponse";

export default class RegisterUseCase implements IUseCase<RegisterRequest, RegisterResponse> {

  async execute(request: RegisterRequest): Promise<Result<RegisterResponse>> {
    const existingUser: UserDocument = await UserModel.findOne({
      username: request.username,
    }, { username: 1 }).exec();

    if (existingUser) {
      return Result.fail({
        statusCode: 400,
        message: "Duplicate error",
        body: {
          errors: {
            email: "User with this username exists"
          }
        }
      });
    }

    const newUser = new UserModel({
      username: request.username,
      password: await this.createHash(request.password),
      coins: 10000
    });

    const newUserResult: IUserModel = await newUser.save();

    return Result.ok<RegisterResponse>(newUserResult);
  }
  
  private async createHash(password: string): Promise<string> {
      const salt = await bcrypt.genSalt(10);

      return await bcrypt.hash(password, salt);
  }
}
