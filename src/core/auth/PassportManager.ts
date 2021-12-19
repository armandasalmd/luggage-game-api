import passport from "passport";
import jwt from "jsonwebtoken";
import { Application } from "express";

import { PassportConfig } from "@core/config";
import { IPayload } from "@core/interfaces";
import { IPassportManager } from "./IPassportManager";
import { FacebookStrategy, GoogleStrategy, LocalStrategy } from "./strategies";
import ISerializedUser from "./ISerializedUser";

class PassportManager implements IPassportManager {
  private app: Application;
  public passportConfig: PassportConfig;

  constructor(app: Application) {
    this.app = app;
    this.passportConfig = new PassportConfig();
  }

  public init() {
    this.app.use(passport.initialize());

    passport.use(LocalStrategy(this.passportConfig.localStrategyOptions));
    passport.use(GoogleStrategy(this.passportConfig.googleStrategyOptions));
    passport.use(FacebookStrategy(this.passportConfig.facebookStrategyOptions));

    passport.serializeUser(this.serializeUser.bind(this));
    passport.deserializeUser(this.deserializeUser.bind(this));
  }

  public serializeUser(user: IPayload, done: any) {
    // Payload: Payload => Token: ISerializedUser
    const userToken: ISerializedUser = {
      token: jwt.sign(user, this.passportConfig.secret, {
        expiresIn: this.passportConfig.expiresIn,
      }),
    };

    done(null, userToken);
  }

  public deserializeUser(user: ISerializedUser, done: any) {
    // Token: ISerializedUser => Payload:Payload
    done(null, jwt.decode(user.token));
  }
}

export default PassportManager;
