import jwt from "jsonwebtoken";
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { EnvConfig, PassportConfig } from "@core/config";
import { IPayload } from "@core/interfaces";
import { registerSocketRoutersOnSocket } from "@core/socket";
import GetGameRoomIdUseCase from "@features/game/actions/getGameRoomId/GetGameRoomIdUseCase";
import PublicLobbiesManager from "@features/lobby/actions/publicLobbies/PublicLobbiesManager";

/**
 * Socket routers
 */
import { LobbySocketRouter, leaveLobbyEvent } from "@features/lobby/infra/LobbySocketRouter";
import { GameSocketRouter } from "@features/game/infra/GameSocketRouter";

export default class SocketApp {
  private static instance: SocketApp;

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

    PublicLobbiesManager.getInstance(this.io); // Initialise public lobbies manager
    SocketApp.instance = this;
  }

  public static getInstance() {
    return SocketApp.instance;
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
    registerSocketRoutersOnSocket(socket, [LobbySocketRouter, GameSocketRouter]);

    const resultPromise = new GetGameRoomIdUseCase().execute(socket.data.user.username);

    resultPromise
      .then((result) => {
        if (result.value) socket.join(result.value);
      })
      .catch(() => {
        console.warn("Could not rejoin active game");
      });

    socket.on("disconnect", this.onDisconnection.bind(this, socket));
  }

  private onDisconnection(socket: Socket): void {
    leaveLobbyEvent.controller.execute(undefined, () => undefined, socket);
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
