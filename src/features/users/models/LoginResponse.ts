import { CoinsAndRewardsResponse } from "./CoinsAndRewardsResponse";
export interface LoginResponse extends CoinsAndRewardsResponse {
  success: boolean;
  token: string;
}
