export enum LogType {
  ControllerException = "controller-error",
  DatabaseException = "database-error",
  SocketException = "socket-error",
  Login = "login",
  None = "none",
}

export default interface ILogModel {
  dateCreated: Date;
  message: string;
  type: LogType;
  username: string;
}