import { Socket } from "socket.io";
import { IPayload } from "@core/interfaces";
import { callIfFunction } from "@utils/Global";
import type { EmitEventType } from "@core/socket";

export default abstract class SocketController<T> {
  protected dataIn: T;
  protected socket: Socket;

  public get user(): IPayload {
    return this.socket.data.user;
  }

  protected abstract executeImpl(
    dataIn: string,
    socket?: Socket
  ): Promise<void | any>;

  public async execute(dataIn: any, callback: any, socket: Socket): Promise<void> {
    this.dataIn = dataIn;
    this.socket = socket;

    const result = await this.executeImpl(dataIn, socket);

    callIfFunction(callback, result);
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

  protected joinRoom(roomId: string) {
    this.socket.join(roomId);
  }
  
  protected leaveRoom(roomId: string) {
    this.socket.leave(roomId);
  }
}