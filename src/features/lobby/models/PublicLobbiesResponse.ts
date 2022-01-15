import { IPaginatedResult } from "@core/interfaces";
import { IPublicGame } from "./IPublicGame";

export interface PublicLobbiesResponse extends IPaginatedResult {
  games: IPublicGame[];
}
