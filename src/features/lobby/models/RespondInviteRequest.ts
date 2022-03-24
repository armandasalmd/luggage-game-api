import { IsBoolean, IsNotEmpty } from "class-validator";

export class RespondInviteRequest {
  @IsBoolean()
  accept: boolean;
  @IsNotEmpty()
  roomCode: string;
}