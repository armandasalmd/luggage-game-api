import IGameDetails from "./IGameDetails";
import IMyPlayerState from "./IMyPlayerState";
import IPublicPlayerState from "./IPublicPlayerState";

export interface PlayCardResult {
  message?: string;
  newGameDetailsState: IGameDetails;
  newMyState: IMyPlayerState;
  newPublicState: IPublicPlayerState;
}