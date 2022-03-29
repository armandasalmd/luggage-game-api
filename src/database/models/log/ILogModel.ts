export enum LogType {
  ControllerException = "controller-exception",
  DatabaseException = "database-exception",
  Login = "login",
  None = "none",
}

export default interface ILogModel {
  dateCreated: Date;
  message: string;
  type: LogType;
  username: string;
}