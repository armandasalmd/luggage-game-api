import { IRoute } from "@core/interfaces";
import { Router, Request, Response } from "express";

const TestPublicRouter: IRoute = {
  path: "/test/public",
  router: Router(),
  authRequired: false,
}

const TestPrivateRouter: IRoute = {
  path: "/test/private",
  router: Router(),
  authRequired: true,
}

TestPublicRouter.router.get("/", (req: Request, res: Response) => {
  res.send({
    message: "This is public route"
  });
});

TestPrivateRouter.router.get("/", (req: Request, res: Response) => {
  res.send({
    message: "This is private route. Auth token is required."
  });
});

export { TestPublicRouter, TestPrivateRouter };
