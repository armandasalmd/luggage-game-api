import IGameDetails from "./IGameDetails";
import IMyPlayerState from "./IMyPlayerState";
import IPublicPlayerState from "./IPublicPlayerState";

export interface GetGameStateResponse {
  gameDetails: IGameDetails;
  myState: IMyPlayerState;
  playersState: IPublicPlayerState[];
}