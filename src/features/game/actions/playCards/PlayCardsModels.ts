import { ISuccessResult } from "@core/interfaces";
import { IMyPlayerState } from "../../models";
import { TakeLuggageResult } from "../takeLuggage";

export class PlayCardsRequest {
  cards: string[];
}

export interface PlayCardsQuery extends PlayCardsRequest {
  gameId: string;
  username: string;
}

export interface PlayCardsResult {
  cards: string[];
  seatId: number;
  takeLuggageResult?: TakeLuggageResult;
  myPlayerState?: IMyPlayerState;
}

export interface PlayCardsResponse extends ISuccessResult {
  myPlayerState?: IMyPlayerState;
}
