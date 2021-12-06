import { cleanEnv, port, str } from "envalid";

export class BaseConfig {
  public validate() {
    const variables = {
      PORT: port(),
      NODE_ENV: str(),
      JWT_SECRET: str(),
    };

    variables[process.env.NODE_ENV === "development" ? "MONGO_URI_DEV" : "MONGO_URI_PROD"] = str();
    cleanEnv(process.env, variables);
  }

  protected getString(key: string): string {
    const configValue = process.env[key];

    if (!configValue) {
      throw new Error(`Missing required env ${key}`);
    }

    return configValue;
  }

  protected getStringOrDefault(key: string): string | undefined {
    return process.env[key];
  }

  protected getInt(key: string): number {
    return parseInt(this.getString(key), 10);
  }

  protected getIntOrDefault(key: string): number | undefined {
    const configValue = process.env[key];

    return configValue ? parseInt(configValue, 10) : undefined;
  }

  protected getBoolean(key: string): boolean {
    return this.getString(key) === "true";
  }

  protected getBooleanOrDefault(key: string) {
    return process.env[key] ? process.env[key] === "true" : undefined;
  }
}
