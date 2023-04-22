import jwt from "jsonwebtoken";
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { EnvConfig, PassportConfig } from "@core/config";
import { IPayload, ISuccessResult } from "@core/interfaces";
import { EmitEventType, registerSocketRoutersOnSocket } from "@core/socket";
import PublicLobbiesManager from "@features/lobby/actions/publicLobbies/PublicLobbiesManager";

/**
 * Socket routers
 */
import { LobbySocketRouter, leaveLobbyEvent } from "@features/lobby/infra/LobbySocketRouter";
import { GameSocketRouter, disconnectGameEvent } from "@features/game/infra/GameSocketRouter";

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
        origin: [...EnvConfig.allowedOrigins, "https://admin.socket.io"],
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
    socket.on("disconnect", this.onDisconnection.bind(this, socket));
  }

  private onDisconnection(socket: Socket): void {
    leaveLobbyEvent.controller().execute(undefined, (result: ISuccessResult) => {
      if (!result.success) {
        // No lobby was disconnected, attempt to disconnect game instead
        disconnectGameEvent.controller().execute(undefined, () => undefined, socket);
      }
    }, socket);
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

  public getSocket(username: string): Socket {
    for (const [_, socket] of this.io.sockets.sockets.entries()) {
      if (socket.data.user.username === username) return socket;
    }
  }

  public tryEmitToUsername(username: string, eventName: EmitEventType, payload: any): boolean {
    const socket: Socket = this.getSocket(username);

    if (socket) {
      this.io.to(socket.id).emit(eventName, payload);
      return true;
    }

    return false;
  }
}
