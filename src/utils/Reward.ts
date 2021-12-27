import { DailyRewardState, IDailyRewardModel } from "@database";
import { dateDiffInHours } from "./Global";

export const REWARD_THRESHOLD_HOURS = 28;

export interface IDailyReward {
  day: number;
  reward: number;
  state?: DailyRewardState;
}

export function getDefaultRewards(): IDailyReward[] {
  return [
    {
      day: 1,
      reward: 100,
    },
    {
      day: 2,
      reward: 150,
    },
    {
      day: 3,
      reward: 200,
    },
    {
      day: 4,
      reward: 500,
    },
    {
      day: 5,
      reward: 1000,
    },
    {
      day: 6,
      reward: 1200,
    },
    {
      day: 7,
      reward: 2000,
    },
  ];
}

export function getDailyRewards(rewardsModel: IDailyRewardModel): Required<IDailyReward>[] {
  const base = getDefaultRewards();
  const rewards: Required<IDailyReward>[] = [];

  for (const baseReward of base) {
    rewards.push({
      ...baseReward,
      state: baseReward.day <= rewardsModel.lastClaimDay ? "claimed" : "disabled",
    });
  }

  if (canClaim(rewardsModel)) {
    const nextReward = rewards.find((item) => item.day === rewardsModel.lastClaimDay + 1);
    nextReward.state = "available";
  }

  return rewards;
}

export function canClaim(rewardsModel: IDailyRewardModel): boolean {
  const today = new Date();

  return (
    rewardsModel.lastClaimDay === 0 ||
    (dateDiffInHours(rewardsModel.lastClaimDate, today) <= REWARD_THRESHOLD_HOURS &&
      rewardsModel.lastClaimDate.getDate() < today.getDate())
  );
}

export function rewardShouldReset(rewardsModel: IDailyRewardModel): boolean {
  return dateDiffInHours(rewardsModel.lastClaimDate, new Date()) > REWARD_THRESHOLD_HOURS;
}

export function getDefaultReward(day: number): IDailyReward {
  return getDefaultRewards().find((item) => item.day === day);
}
