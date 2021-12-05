import { Request } from "express";
import { Strategy } from "passport-jwt";

import { UserModel } from "@database";
import { IPayload } from "@core/interfaces";

export interface ILocalStrategyOptions {
  jwtFromRequest: any;
  secretOrKey: string;
  passReqToCallback?: boolean;
}

function LocalStrategy(options: ILocalStrategyOptions): Strategy {
  return new Strategy(
    options,
    (req: Request, jwtPayload: IPayload, done: any) => {
      UserModel.findById(jwtPayload.id)
        .then((user) => {
          if (user) {
            req.user = jwtPayload;

            return done(null, jwtPayload);
          }
          return done(null, false);
        })
        .catch(() => done(null, false));
    }
  );
}

export default LocalStrategy;
