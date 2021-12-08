import jwt from "jsonwebtoken";
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { EnvConfig, PassportConfig } from "@core/config";
import { IPayload } from "@core/interfaces";
import { registerSocketRoutersOnSocket } from "@core/socket";

/**
 * Socket routers
 */
import { LobbySocketRouter } from "@features/lobby/infra/LobbySocketRouter";

export default class SocketApp {
  public envConfig: EnvConfig;
  public passportConfig: PassportConfig;
  public io: Server;

  constructor(env: EnvConfig, httpServer: HttpServer) {
    this.envConfig = env;
    this.passportConfig = new PassportConfig();

    this.io = SocketApp.createIOServer(httpServer);
    this.io.use(this.authMiddleware.bind(this));
    this.io.on("connection", this.onConnection.bind(this));

    this.setupAdminPage();
  }

  private static createIOServer(httpServer: HttpServer): Server {
    return new Server(httpServer, {
      cors: {
        origin: [
          "https://admin.socket.io",
          "http://localhost:3000",
          "https://luggage-game.vercel.app",
        ],
        credentials: true,
      },
    });
  }

  private setupAdminPage() {
    if (this.envConfig.isDevelopment) {
      instrument(this.io, { auth: false });
    }
  }

  private onConnection(socket: Socket): void {
    // runs all the time client connects to the server
    registerSocketRoutersOnSocket(socket, [LobbySocketRouter]);
  }

  private authMiddleware(socket: Socket, next: any): void {
    const { token } = socket.handshake.auth;

    if (token) {
      const tokenIsValid = jwt.verify(token, this.passportConfig.secret);

      if (tokenIsValid) {
        const decoded: IPayload = jwt.decode(token) as IPayload;
        socket.data.user = decoded;

        next();
        return;
      }
    }

    next(new Error("No authentication found. Access denied"));
  }
}
