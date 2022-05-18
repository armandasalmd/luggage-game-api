import { BaseConfig } from "./BaseConfig";

export class RedisConfig extends BaseConfig {
  public get uri(): string {
    return this.getString("REDIS_URI");
  }
}
