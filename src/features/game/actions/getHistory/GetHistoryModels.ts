import { PaginatedQuery } from "@core/interfaces";
import { IPaginatedResult } from "@core/interfaces";
import { IHistoryItem } from "../../models";

export class GetHistoryRequest extends PaginatedQuery {}

export interface GetHistoryResponse extends IPaginatedResult {
  items: IHistoryItem[];
}