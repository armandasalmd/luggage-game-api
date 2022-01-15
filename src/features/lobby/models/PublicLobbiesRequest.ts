import { IPaginatedQuery } from "@core/interfaces";

export interface PublicLobbiesRequest extends IPaginatedQuery {
  gamePrice?: number;
  gameMode?: string;
}
