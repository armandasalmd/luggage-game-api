import { Request, Response } from "express";
import { Result } from "./Result";
import { IHttpError, IHttpResult } from "@core/interfaces";

export abstract class HttpController {
  protected req: Request;
  protected res: Response;

  protected abstract executeImpl(
    req?: Request,
    res?: Response
  ): Promise<void | IHttpResult | Result<any>>;

  public execute(req: Request, res?: Response): void {
    this.req = req;
    this.res = res;

    try {
      const promise: Promise<void | IHttpResult | Result<any>> = this.executeImpl(req, res);

      promise.then((result: void | IHttpResult) => {
        if (result instanceof Result) {
          this.respondWithResult(result);
        } else if (result) {
          this.json(result.statusCode, result.body);
        }
      });
    } catch (err) {
      this.fail("Cannot execute given request");
    }
  }

  private static jsonResponse(
    res: Response,
    code: number,
    message: string
  ) {
    return res.status(code).json({ message, statusCode: code });
  }

  public ok<T>(dto?: T) {
    if (!!dto) {
      return this.res.status(200).json(dto);
    } else {
      return this.res.sendStatus(200);
    }
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  public json(code: number, body: any) {
    return this.res.status(code).json(body);
  }

  public clientError(message?: string) {
    return HttpController.jsonResponse(
      this.res,
      400,
      message ? message : "Wrong request"
    );
  }

  public unauthorized(message?: string) {
    return HttpController.jsonResponse(
      this.res,
      401,
      message ? message : "Unauthorized"
    );
  }

  public paymentRequired(message?: string) {
    return HttpController.jsonResponse(
      this.res,
      402,
      message ? message : "Payment required"
    );
  }

  public forbidden(message?: string) {
    return HttpController.jsonResponse(
      this.res,
      403,
      message ? message : "Forbidden"
    );
  }

  public notFound(message?: string) {
    return HttpController.jsonResponse(
      this.res,
      404,
      message ? message : "Not found"
    );
  }

  public conflict(message?: string) {
    return HttpController.jsonResponse(
      this.res,
      409,
      message ? message : "Conflict"
    );
  }

  public tooMany(message?: string) {
    return HttpController.jsonResponse(
      this.res,
      429,
      message ? message : "Too many requests"
    );
  }

  public fail(error: IHttpError | string) {
    if (typeof error === "string") {
      console.log(`Fail: ${error}`);

      return this.res.status(500).json({ statusCode: 500, message: error });
    } else {
      console.log(`Fail: ${error.message}`);
      if (error.body) {
        return this.res.status(error.statusCode).json(error.body);
      } else {
        return this.res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
        });
      }
    }
  }

  public respondWithResult(result: Result<any>) {
    if (result.isFailure) {
      this.fail(result.error);
    } else {
      this.ok(result.value);
    }
  }
}
