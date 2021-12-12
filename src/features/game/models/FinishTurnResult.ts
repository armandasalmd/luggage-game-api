import IGameDetails from "./IGameDetails";
import IMyPlayerState from "./IMyPlayerState";

export interface FinishTurnResult {
  gameDetails: IGameDetails;
  myState: IMyPlayerState;
}