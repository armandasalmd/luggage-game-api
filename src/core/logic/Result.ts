import { IHttpError } from "@core/interfaces";

export type ResultError = string | IHttpError | Error;

export class Result<T> {
  private _error: IHttpError;
  private _value: T;
  public isSuccess: boolean;

  public get isFailure(): boolean {
    return !this.isSuccess;
  }

  public get error(): IHttpError {
    if (this.isSuccess) {
      console.log(this.error);
      throw new Error("Can't get the value of an result. Use 'value' instead.");
    }

    return this._error;
  }

  public get value(): T {
    if (!this.isSuccess) {
      console.log(this.error);
      throw new Error(
        "Can't get the value of an error result. Use 'error' instead."
      );
    }

    return this._value;
  }

  public constructor(isSuccess: boolean, error?: ResultError, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        "InvalidOperation: A result cannot be successful and contain an error"
      );
    }

    if (!isSuccess && !error) {
      throw new Error(
        "InvalidOperation: A failing result needs to contain an error message"
      );
    }

    if (typeof error === "string") {
      this._error = { statusCode: 500, message: error };
    } else if (error instanceof Error) {
      this._error = { statusCode: 500, message: error.message };
    } else {
      this._error = error;
    }

    this.isSuccess = isSuccess;
    this._value = value;

    Object.freeze(this);
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: ResultError): Result<U> {
    return new Result<U>(false, error);
  }
}
