import { cleanEnv, port, str } from "envalid";
import { BaseConfig } from "./BaseConfig";

export class EnvConfig extends BaseConfig {
  public static productionDomain = "https://luggage-game.vercel.app";
  public static developmentDomain = "http://localhost:3000";
  public static allowedOrigins = [
    EnvConfig.productionDomain,
    EnvConfig.developmentDomain,
    "https://luggage-game-1uoitvxv7-armandasbark.vercel.app",
  ];

  public get clientHostName(): string {
    return this.isProduction === true
      ? EnvConfig.productionDomain
      : EnvConfig.developmentDomain;
  }

  public get port(): number {
    return this.getInt("PORT");
  }

  public get type(): string {
    return this.getString("NODE_ENV");
  }

  public get isDevelopment(): boolean {
    return this.type === "development";
  }

  public get isProduction(): boolean {
    return this.type === "production";
  }

  public validate() {
    const variables = {
      PORT: port(),
      NODE_ENV: str(),
      JWT_SECRET: str(),
      GOOGLE_CLIENT_ID: str(),
      GOOGLE_CLIENT_SECRET: str(),
      FACEBOOK_CLIENT_ID: str(),
      FACEBOOK_CLIENT_SECRET: str(),
    };

    variables[
      process.env.NODE_ENV === "development"
        ? "MONGO_URI_DEV"
        : "MONGO_URI_PROD"
    ] = str();
    cleanEnv(process.env, variables);
  }
}
