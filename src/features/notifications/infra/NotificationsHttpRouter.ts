import { Router } from "express";
import { IRoute } from "@core/interfaces";
import { GetNotificationsController } from "../actions/getNotifications/GetNotificationsController";

const NotificationRouter: IRoute = {
  path: "/notification",
  router: Router(),
  authRequired: true,
};

NotificationRouter.router.get("/", new GetNotificationsController().toRoute());

export { NotificationRouter };