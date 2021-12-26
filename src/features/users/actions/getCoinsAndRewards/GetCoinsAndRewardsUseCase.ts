import { isValidObjectId } from "mongoose";

import { IUseCase, Result } from "@core/logic";
import { IDailyRewardModel, UserModel, UserDocument } from "@database";
import { CoinsAndRewardsResponse } from "@features/users/models/CoinsAndRewardsResponse";
import { getDailyRewards, rewardShouldReset } from "@utils/Reward";

export class GetCoinsAndRewardsUseCase implements IUseCase<string, CoinsAndRewardsResponse> {
  async execute(userId: string): Promise<Result<CoinsAndRewardsResponse>> {
    if (!isValidObjectId(userId)) return Result.fail("User id is not valid");

    const userWithReward: UserDocument = await UserModel.findById(userId, { coins: 1, dailyReward: 1 });

    if (!userWithReward) return Result.fail("User not found");

    if (!userWithReward.dailyReward || rewardShouldReset(userWithReward.dailyReward)) {
      userWithReward.dailyReward = this.createNewRewardModel();
      await userWithReward.save();
    }

    const result: CoinsAndRewardsResponse = {
      coins: userWithReward.coins,
      rewards: getDailyRewards(userWithReward.dailyReward),
    };

    return Result.ok(result);
  }

  private createNewRewardModel(): IDailyRewardModel {
    return {
      lastClaimDate: new Date(),
      lastClaimDay: 0,
    };
  }
}
