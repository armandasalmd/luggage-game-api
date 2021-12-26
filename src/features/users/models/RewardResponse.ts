import { DailyRewardState } from "@database";

export interface RewardResponse {
  reward: number;
  state: DailyRewardState;
  day: number;
}