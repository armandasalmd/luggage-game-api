import { Router } from "express";

import { IRoute } from "@core/interfaces";
import { LoginController } from "../actions/login/LoginController";
import { RegisterController } from "../actions/register/RegisterController";

const UserRouter: IRoute = {
  path: "/users",
  router: Router(),
  authRequired: false,
};

UserRouter.router.post("/login", (req, res) => new LoginController().execute(req, res));
UserRouter.router.post("/register", (req, res) => new RegisterController().execute(req, res));

export default UserRouter;