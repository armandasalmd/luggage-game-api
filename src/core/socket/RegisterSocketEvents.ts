import { Socket } from "socket.io";
import { ISocketEvent, ISocketRouter } from ".";

export function registerSocketEventForSocket(socket: Socket, event: ISocketEvent<unknown>) {
  socket.on(event.eventName, (message, callback) => {
    event.controller.execute(message, callback, socket);
  });
}

export function registerSocketRoutersOnSocket(
  socket: Socket,
  routers: ISocketRouter[]
) {
  for (const router of routers) {
    for (const event of router.events) {
      registerSocketEventForSocket(socket, event);
    }
  }
}
