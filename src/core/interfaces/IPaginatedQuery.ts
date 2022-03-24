import { IsNumber, Min, Max } from "class-validator";

export interface IPaginatedQuery {
  pageNumber: number;
  pageSize: number;
}

export class PaginatedQuery {
  @IsNumber()
  @Min(1)
  pageNumber: number;
  @Min(0)
  @Max(100)
  pageSize: number;
}