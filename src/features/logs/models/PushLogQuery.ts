import { ILogModel } from "@database";

export interface PushLogQuery extends Omit<ILogModel, "dateCreated"> {}