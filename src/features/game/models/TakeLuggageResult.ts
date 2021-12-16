import IMyPlayerState from "./IMyPlayerState";
import IPublicPlayerState from "./IPublicPlayerState";

export interface TakeLuggageResult {
  newPublicState: IPublicPlayerState;
  newMyState: IMyPlayerState;
}