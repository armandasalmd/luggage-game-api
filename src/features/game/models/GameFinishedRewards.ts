import IGameDetails from "./IGameDetails";

export interface PlayerReward {
  reward: number;
  username: string;
}

export interface GameFinishedRewards {
  winners: PlayerReward[];
  looserUsername: string;
  looseAmount: number;
  roomId: string;
  gameDetails: IGameDetails;
}