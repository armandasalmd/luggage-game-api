import { Request } from "express";
import { IPayload } from "./IPayload";

export interface IUserRequest<T> extends Request {
  user: IPayload;
  body: T | undefined;
}
