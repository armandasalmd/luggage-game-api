import { Router } from "express";
import { IRoute } from "@core/interfaces";
import { GetCoinsAndRewardsController } from "../actions/getCoinsAndRewards/GetCoinsAndRewardsController";
import { LoginController } from "../actions/login/LoginController";
import { RegisterController } from "../actions/register/RegisterController";
import { ClaimDailyRewardController } from "../actions/claimDailyReward/ClaimDailyRewardController";

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
UserPrivateRouter.router.get("/coinsAndRewards", (req, res) =>
  new GetCoinsAndRewardsController().execute(req, res)
);
UserPrivateRouter.router.post("/claimReward", (req, res) =>
  new ClaimDailyRewardController().execute(req, res)
);

export { UserRouter, UserPrivateRouter };
