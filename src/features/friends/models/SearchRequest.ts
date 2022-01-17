import { IPaginatedQuery } from "@core/interfaces";

export interface SearchRequest extends IPaginatedQuery {
  clientUsername?: string;
  searchTerm: string;
}