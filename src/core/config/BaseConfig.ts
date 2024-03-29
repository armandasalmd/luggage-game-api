export class BaseConfig {
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
