import { Request, Response } from "express";
import { Result } from ".";
import { IHttpError, IHttpResult, IResponseBody } from "@core/interfaces";

type ExecuteReturnType = void | IHttpResult | Result<any>;

export abstract class HttpController {

  public toRoute() {
    return (req: Request, res: Response) => this.execute(req, res);
  }

  protected req: Request;
  protected res: Response;

  protected abstract executeImpl(req?: Request, res?: Response): Promise<ExecuteReturnType>;

  /**
   * =======================
   *   RESPONSE SHORTHANDS
   * =======================
   */  
  protected clientError(message?: string) {
    return this.jsonMessage(400, message ? message : "Wrong request");
  }

  protected conflict(message?: string) {
    return this.jsonMessage(409, message || "Conflict");
  }

  protected tooMany(message?: string) {
    return this.jsonMessage(429, message || "Too many requests");
  }

  /**
   * =======================
   *       CORE LOGIC
   * =======================
   */  
  protected json(code: number, body: any) {
    // Single responding funtion - important
    return this.res.status(code).json(body);
  }

  protected ok<T>(dto?: T) {
    if (dto)
      return this.json(200, dto);
    else
      return this.res.sendStatus(200);
  }

  protected fail(error: IHttpError | string) {
    // console.log(`Fail: ${error.message || error}`);
    if (typeof error === "string") return this.jsonMessage(500, error);
    else if (error.body) return this.json(error.statusCode, error.body);
    else return this.jsonMessage(error.statusCode, error.message);
  }

  protected respondWithResult(result: Result<any>) {
    return result.isFailure ? this.fail(result.error) : this.ok(result.value);
  }

  protected execute(req: Request, res: Response): void {
    this.req = req;
    this.res = res;

    this.executeImpl(req, res)
      .then((result: ExecuteReturnType) => {
        if (result instanceof Result)
          this.respondWithResult(result);
        else if (result)
          this.json(result.statusCode, result.body);
        else
          this.ok();
      })
      .catch((_error) => {
        this.fail("Cannot execute given request");
      });
  }

  private jsonMessage(statusCode: number, message?: string) {
    const body: IResponseBody = { statusCode };
    if (message) body.message = message;

    return this.json(statusCode, body);
  }
}
