import IGameDetails from "./IGameDetails";
import IMyPlayerState from "./IMyPlayerState";
import IPublicPlayerState from "./IPublicPlayerState";

export interface Looser {
  username: string;
  price: number;
}

export interface FinishTurnResult {
  gameDetails: IGameDetails;
  myState: IMyPlayerState;
  myPublicState?: IPublicPlayerState;
  finishReward?: number;
  looser?: Looser;
}