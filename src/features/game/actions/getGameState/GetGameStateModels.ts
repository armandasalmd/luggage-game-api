import { IsNotEmpty, IsString } from "class-validator";
import { IGameDetails, IMyPlayerState, IPublicPlayerState } from "@features/game/models";

export class GetGameStateRequest {
  @IsNotEmpty({
    message: "Please provide game id"
  })
  @IsString()
  gameId: string;
}

export class GetGameStateResponse {
  gameDetails: IGameDetails;
  myState: IMyPlayerState;
  playersState: IPublicPlayerState[];
}

export interface GetGameStateQuery {
  gameId: string;
  username: string;
}

// tslint:disable-next-line
export interface GetGameStateResult extends GetGameStateResponse {}
