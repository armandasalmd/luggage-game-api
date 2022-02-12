import { IsNumber, Min, Max, IsIn, IsBoolean, IsString } from "class-validator";
import { GameRulesType, gamePrices, gameRules } from "@utils/Lobby";

export class CreateLobbyRequest {
  @IsNumber()
  @Min(2)
  @Max(5)
  playerCount: number;
  
  @IsNumber()
  @IsIn(gamePrices)
  gamePrice: number;

  @IsBoolean()
  isPrivate: boolean;

  @IsString()
  @IsIn(gameRules)
  gameRules: GameRulesType;
}