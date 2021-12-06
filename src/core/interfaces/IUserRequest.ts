import { Request } from "express";
import { IPayload } from "./IPayload";

export interface IUserRequest extends Request {
    user: IPayload;
}