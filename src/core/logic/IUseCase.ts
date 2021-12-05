import { IPayload } from "../interfaces";
import { Result } from "./Result";

export interface IUseCase<Input, Output> {
  execute(request?: Input, user?: IPayload): Promise<Result<Output>> | Result<Output>;
}
