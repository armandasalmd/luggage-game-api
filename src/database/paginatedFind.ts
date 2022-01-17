import { FilterQuery, Model } from "mongoose";
import { IPaginatedQuery } from "@core/interfaces";

export function paginatedFind<T>(
  model: Model<T>,
  pagination: IPaginatedQuery,
  query: FilterQuery<T>,
  project?: object
) {
  return model.aggregate([
    { $match: query },
    { $skip: pagination.pageSize * (pagination.pageNumber - 1) },
    { $limit: pagination.pageSize },
    { $project: project },
  ]);
}
