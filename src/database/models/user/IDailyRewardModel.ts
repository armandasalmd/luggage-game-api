export type DailyRewardState = "claimed" | "available" | "disabled";

export default interface IDailyRewardModel {
  lastClaimDay: number;
  lastClaimDate: Date;
}