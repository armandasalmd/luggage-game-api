import { BaseConfig } from "./BaseConfig";

export class EnvConfig extends BaseConfig {
    public static productionDomain = "https://luggage-game.vercel.app";
    public static developmentDomain = "http://localhost:3000";
    public static allowedOrigins = [
        EnvConfig.productionDomain,
        EnvConfig.developmentDomain
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
}