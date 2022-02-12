
import { Request, Response } from "express";
import { validateSync, ValidationError } from "class-validator";
import { plainToClass, ClassConstructor } from "class-transformer";

import { HttpController, Result } from ".";
import { IHttpResult, IResponseBody, IResponseError } from "@core/interfaces";

export abstract class HttpValidatedController extends HttpController {

  public toRoute() {
    return (req: Request, res: Response) => this.validateAndExecute(req, res);
  }

  protected abstract readonly validationClass: ClassConstructor<any>;
  protected abstract executeImpl(req?: Request, res?: Response): Promise<void | IHttpResult | Result<any>>;

  private validateAndExecute(req: Request, res: Response): void {
    this.req = req;
    this.res = res;

    if (this.validationClass !== undefined) {
      const errors = validateSync(plainToClass(this.validationClass, req.body) as unknown as object);

      if (errors && errors.length > 0) {
        this.json(400, this.genBodyWithErrors(errors));
        return;
      }
    }
    
    this.execute(req, res);
  }

  private genBodyWithErrors(errors: ValidationError[]): IResponseBody {
    const result: IResponseBody = {};

    if (errors && errors.length === 0) return result;

    return {
      message: "Check field errors",
      fieldErrors: this.toFieldErrors(errors)
    };
  }

  private toFieldErrors(errors: ValidationError[]): IResponseError {
    const result: IResponseError = {};

    for (const error of errors) {
      const message = Object.values(error.constraints || {}).find(() => true) || "Error";

      result[error.property] = message;
    }

    return result;
  }
}