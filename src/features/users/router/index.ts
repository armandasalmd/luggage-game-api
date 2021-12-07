import { Router } from "express";
import { IRoute } from "@core/interfaces";
import { GetCoinsController } from "../actions/getCoins/GetCoinsController";
import { LoginController } from "../actions/login/LoginController";
import { RegisterController } from "../actions/register/RegisterController";

const UserRouter: IRoute = {
  path: "/users",
  router: Router(),
  authRequired: false,
};

const UserPrivateRouter: IRoute = {
  path: "/users",
  router: Router(),
  authRequired: true,
};

UserRouter.router.post("/login", (req, res) => new LoginController().execute(req, res));
UserRouter.router.post("/register", (req, res) => new RegisterController().execute(req, res));
UserPrivateRouter.router.get("/coins", (req, res) => new GetCoinsController().execute(req, res));

export { UserRouter, UserPrivateRouter };