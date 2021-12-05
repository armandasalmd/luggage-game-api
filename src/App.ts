import express, { Application } from "express";
import { connection, connect } from "mongoose";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import logger from "morgan";
import path from "path";

import { EnvConfig, MongoConfig } from "@core/config";
import { IRoute } from "@core/interfaces";
import PassportManager from "@core/auth/PassportManager";
import { AuthMiddleware, CorsMiddleware } from "@core/middlewares";

class App {
  /**
   * Properties
   */
  public app: Application;
  public envConfig: EnvConfig;
  public mongoConfig: MongoConfig;
  public prefix: string;
  public passportManager: PassportManager;

  /**
   * Getter properties
   */
  public get port(): number {
    return this.envConfig.port;
  }

  /**
   * Initialize the RESTFul API
   * @param routes List of express routers to
   */
  constructor(routes: IRoute[], prefix?: string) {
    this.app = express();
    this.envConfig = new EnvConfig();
    this.mongoConfig = new MongoConfig();
    this.prefix = prefix;
    this.passportManager = new PassportManager(this.app);

    this.envConfig.validate();
    this.app.enable("trust proxy");

    this.connectToDatabase();
    this.initMiddlewares();
    this.passportManager.init();
    this.initRoutes(routes);
    this.initDefaultHandler();
  }

  private connectToDatabase() {
    connection.on("error", console.error.bind(console, "connection error:"));
    connection.once("open", () => {
      console.log(`Mongoose connected to ${this.mongoConfig.uriDisplayName}`);
    });
    connect(this.mongoConfig.uri, this.mongoConfig.options);
  }

  private initDefaultHandler() {
    this.app.use((req, res) => {
      res.status(404).json({
        statusCode: 404,
        message: `Cannot find ${req.path}`,
      });
    });
  }

  private initMiddlewares() {
    if (this.envConfig.isDevelopment) {
      this.app.use(logger("dev"));
    } else if (this.envConfig.isProduction) {
      this.app.use(helmet());

      const limiter = rateLimit({
        windowMs: 600000, // 10 minutes
        max: 1800,
        message: "Too many requests made to the server. Try again later!",
      });

      this.app.use(limiter);
    }
    // Middleware for all envs
    this.app.use(CorsMiddleware);
    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initRoutes(routes: IRoute[]) {
    routes.forEach((route: IRoute) => {
      // If prefix exists for routes, extend with it
      if (!!this.prefix)
        route.path = path.join(this.prefix, route.path).split("\\").join("/");
      // Init router with auth required
      if (route.authRequired)
        this.app.use(route.path, AuthMiddleware, route.router);
      // Init public router
      else this.app.use(route.path, route.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
