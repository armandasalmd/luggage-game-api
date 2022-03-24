import { IPaginatedResult } from "@core/interfaces";
import { IHistoryItem } from "./IHistoryItem";

export interface HistoryResponse extends IPaginatedResult {
    items: IHistoryItem[];
}