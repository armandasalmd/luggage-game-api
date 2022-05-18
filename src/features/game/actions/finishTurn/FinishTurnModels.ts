import { ISuccessResult } from "@core/interfaces";
import { IGameDetails, IGameRewards, IMyPlayerState, IPublicPlayerState } from "../../models";

export interface FinishTurnQuery {
  gameId: string;
  username: string;
}

export interface FinishTurnResult {
  gameDetails: IGameDetails;
  myState: IMyPlayerState;
  rewardsIfEnded?: IGameRewards;
  myPublicState?: Partial<IPublicPlayerState | { didTakeHome: boolean }>;
}

export interface FinishTurnResponse extends ISuccessResult {
  myPlayerState?: IMyPlayerState;
}
