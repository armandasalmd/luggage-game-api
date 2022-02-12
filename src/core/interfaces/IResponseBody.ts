export interface IResponseError {
  [field:string]: string;
}

export interface IResponseBody {
  data?: any;
  message?: string;
  statusCode?: number;
  fieldErrors?: IResponseError;
}

/**
 * {
 *     data: null,
 *     message: "Check field errors",
 *     fieldErrors: {
 *         username: "Username is required"
 *     }
 * }
 */