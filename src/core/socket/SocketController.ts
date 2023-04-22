import { Socket } from "socket.io";
import { ISocketPayload } from "@core/interfaces";
import type { EmitEventType } from "@core/socket";
import { LogType } from "@database";
import PushLogUseCase from "@features/logs/actions/PushLogUseCase";
import { callIfFunction } from "@utils/Global";
import SocketApp from "../../SocketApp";

export default abstract class SocketController<T> {
  protected dataIn: T;
  protected socket: Socket;

  protected abstract executeImpl(
    dataIn: T,
    socket?: Socket
  ): Promise<void | any>;

  public async execute(dataIn: T, callback: any, socket: Socket): Promise<void> {
    this.dataIn = dataIn;
    this.socket = socket;

    try {
      const result = await this.executeImpl(dataIn, socket);
      callIfFunction(callback, result);
    } catch (error) {
      new PushLogUseCase().execute({
        message: error.message,
        type: LogType.SocketException,
        username: this.user.username,
      });
    }
  }

  protected emitToAll(eventName: EmitEventType, payload: any) {
    this.socket.emit(eventName, payload);
  }

  protected emitToAllExceptYou(eventName: EmitEventType, payload: any) {
    this.socket.broadcast.emit(eventName, payload);
  }

  protected emitToRoom(roomId: string, eventName: EmitEventType, payload: any) {
    this.socket.to(roomId).emit(eventName, payload);
  }

  protected emitToRoomAll(roomId: string, eventName: EmitEventType, payload: any) {
    this.emitToRoom(roomId, eventName, payload);
    this.emitToClient(eventName, payload);
  }

  protected emitToClient(eventName: EmitEventType, payload: any) {
    const socketApp = SocketApp.getInstance();

    if (socketApp) {
      socketApp.io.to(this.socket.id).emit(eventName, payload);
    } else {
      console.warn("Socket app instance is not set");
    }
  }

  protected joinRoom(roomId: string) {
    this.socket.join(roomId);
  }
  
  protected leaveRoom(roomId: string) {
    this.socket.leave(roomId);
  }

  protected get user(): ISocketPayload {
    return this.socket.data.user as ISocketPayload;
  }

  protected set payloadGameId(value: string) {
    this.socket.data.user.gameId = value;
  }

  protected set payloadLobbyId(value: string) {
    this.socket.data.user.lobbyId = value;
  }
}