import { isValidObjectId } from "mongoose";

import { IUseCase, Result } from "@core/logic";
import { IDailyRewardModel, UserModel, UserDocument } from "@database";
import { getDefaultReward, rewardShouldReset, canClaim } from "@utils/Reward";
import { RewardResponse } from "@features/users/models/RewardResponse";
import AddCoinsUseCase from "../addCoins/AddCoinsUseCase";

export class ClaimDailyRewardUseCase implements IUseCase<string, RewardResponse> {
  async execute(userId: string): Promise<Result<RewardResponse>> {
    if (!isValidObjectId(userId)) return Result.fail("User id is not valid");

    const userWithReward: UserDocument = await UserModel.findById(userId, {
      dailyReward: 1,
      username: 1,
    });

    if (!userWithReward) return Result.fail("User not found");

    if (!userWithReward.dailyReward || rewardShouldReset(userWithReward.dailyReward)) {
      userWithReward.dailyReward = this.createNewRewardModel();
      await userWithReward.save();
    }

    const reward = getDefaultReward(userWithReward.dailyReward.lastClaimDay + 1);

    if (!reward) return Result.fail("Reward not found");
    if (!canClaim(userWithReward.dailyReward))
      return Result.fail("Reward was already claimed today");

    const addCoins = new AddCoinsUseCase();
    const addResult = await addCoins.execute({
      amount: reward.reward,
      username: userWithReward.username,
    });

    if (addResult.isFailure) return Result.fail(addResult.error.message);

    userWithReward.dailyReward.lastClaimDay = reward.day >= 7 ? 0 : reward.day;
    userWithReward.dailyReward.lastClaimDate = new Date();
    await userWithReward.save();

    return Result.ok({
      ...reward,
      state: "claimed",
    });
  }

  private createNewRewardModel(): IDailyRewardModel {
    return {
      lastClaimDate: new Date(),
      lastClaimDay: 0,
    };
  }
}
