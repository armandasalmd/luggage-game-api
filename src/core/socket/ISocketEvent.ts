import SocketController from "./SocketController";

export default interface ISocketEvent<T> {
  eventName: string;
  controller: SocketController<T>;
}