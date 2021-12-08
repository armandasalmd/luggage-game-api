import ISocketEvent from "./ISocketEvent";

export default interface ISocketRouter {
  events: ISocketEvent<any>[];
}