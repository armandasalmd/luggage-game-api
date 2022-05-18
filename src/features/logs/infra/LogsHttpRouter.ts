import { Router } from "express";
import { IRoute } from "@core/interfaces";
import { ClearLogsController } from "../actions/clearLogs/ClearLogsController";

const LogRouter: IRoute = {
  path: "/logs",
  router: Router(),
  authRequired: true,
};

LogRouter.router.delete("/", new ClearLogsController().toRoute());

export { LogRouter };