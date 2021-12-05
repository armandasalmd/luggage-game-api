import { NextFunction, Request, Response } from "express";
import { EnvConfig } from "@core/config";

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const { allowedOrigins } = EnvConfig;
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header("Access-Control-Allow-Methods", "*");

  if (
    req.method === "OPTIONS" &&
    !!req.header("Access-Control-Request-Method")
  ) {
    // CORS Preflight check - bounce back the request
    res.status(204).send();
  } else {
    next();
  }
}

export default corsMiddleware;
