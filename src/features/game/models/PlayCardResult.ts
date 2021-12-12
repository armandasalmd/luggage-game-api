import IGameDetails from "./IGameDetails";
import IMyPlayerState from "./IMyPlayerState";

export interface PlayCardResult {
  message?: string;
  newGameDetailsState: IGameDetails;
  newMyState: IMyPlayerState;
}