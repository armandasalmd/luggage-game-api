import { BaseConfig } from "./BaseConfig";
import { EnvConfig } from "./EnvConfig";

export class MongoConfig extends BaseConfig {
  private envConfig: EnvConfig;

  constructor() {
    super();
    this.envConfig = new EnvConfig();
  }

  public get uri(): string {
    return this.envConfig.isProduction === true
      ? this.getString("MONGO_URI_PROD")
      : this.getString("MONGO_URI_DEV");
  }

  public get uriDisplayName(): string {
    return this.envConfig.isProduction === true
      ? "PROD database"
      : "DEV database";
  }

  public get options(): object {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    return options;
  }
}
