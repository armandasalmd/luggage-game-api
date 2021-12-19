import { ExtractJwt } from "passport-jwt";

import { BaseConfig } from "./BaseConfig";
import {
  ILocalStrategyOptions,
  IFacebookStrategyOptions,
  IGoogleStrategyOptions,
} from "@core/auth/strategies";
import { EnvConfig } from "./EnvConfig";

export class PassportConfig extends BaseConfig {
  private envConfig: EnvConfig;

  constructor() {
    super();
    this.envConfig = new EnvConfig();
  }

  public get expiresIn(): number {
    return 604800; // 7 days in seconds
  }

  public get localStrategyOptions(): ILocalStrategyOptions {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.secret,
      passReqToCallback: true, // <= Important, so that the verify function can accept the req param ie verify(req,payload,done)
    };
  }

  public get facebookStrategyOptions(): IFacebookStrategyOptions {
    return {
      callbackURL: "/api/facebook/callback",
      clientID: this.getString("FACEBOOK_CLIENT_ID"),
      clientSecret: this.getString("FACEBOOK_CLIENT_SECRET"),
      profileFields: ["id", "emails", "name", "photos"],
    };
  }

  public get googleStrategyOptions(): IGoogleStrategyOptions {
    return {
      callbackURL: "/api/google/callback",
      clientID: this.getString("GOOGLE_CLIENT_ID"),
      clientSecret: this.getString("GOOGLE_CLIENT_SECRET"),
    };
  }

  public get secret(): string {
    return this.getString("JWT_SECRET");
  }

  public getFailureUrl(failureMessage?: string): string {
    let result = `${this.envConfig.clientHostName}/auth/login`;

    if (failureMessage !== undefined) {
      result += `?errorMsg=${encodeURI(failureMessage)}`;
    }

    return result;
  }

  public getSuccessUrl(token: string): string {
    return `${this.envConfig.clientHostName}/auth/setToken?token=${token}`;
  }
}
