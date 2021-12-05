import { ExtractJwt } from "passport-jwt";
import { BaseConfig } from "./BaseConfig";
import { EnvConfig } from "./EnvConfig";
import { ILocalStrategyOptions } from "@core/auth/strategies";

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

  public get secret(): string {
    return this.getString("JWT_SECRET");
  }
}
