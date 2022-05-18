import { IsArray, IsIn } from "class-validator";
import { LogType } from "@database";

const VALID_VALUES = Object.values(LogType);

export class ClearLogsRequest {
  @IsArray()
  @IsIn(VALID_VALUES, {
    each: true
  })
  types: LogType[];
}