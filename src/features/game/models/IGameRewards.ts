import { PlayerState } from "@utils/Game";

export interface IPlayerReward {
  playerState?: PlayerState | string;
  reward: number;
  username: string;
}

export interface IGameRewards {
  winners: IPlayerReward[];
  looser: IPlayerReward;
  gameId: string;
}