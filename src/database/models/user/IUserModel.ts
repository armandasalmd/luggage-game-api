import IDailyRewardModel from "./IDailyRewardModel";

export enum AuthStrategy {
  Local = "local",
  Google = "google",
  Facebook = "facebook"
}
export default interface IUserModel {
  authStrategies: AuthStrategy[];
  avatar?: string;
  coins: number;
  email?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  username: string;
  dailyReward: IDailyRewardModel;
}