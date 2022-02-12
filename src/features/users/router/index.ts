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

UserRouter.router.post("/login", new LoginController().toRoute());
UserRouter.router.post("/register", new RegisterController().toRoute());
UserPrivateRouter.router.get("/coinsAndRewards", new GetCoinsAndRewardsController().toRoute());
UserPrivateRouter.router.post("/claimReward", new ClaimDailyRewardController().toRoute());

export { UserRouter, UserPrivateRouter };
