import { Router } from "express";
import passport from "passport";

import { IRoute } from "@core/interfaces";
import { PassportConfig } from "@core/config";
import SocialAuthMiddleware from "../SocialAuthMiddleware";

const passportConfig = new PassportConfig();
const googleRouter: IRoute = {
  path: "/google",
  router: Router(),
  authRequired: false,
};

googleRouter.router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

googleRouter.router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: passportConfig.getFailureUrl(
      "failed to authenticate, Try logging in with Facebook"
    ),
  }),
  SocialAuthMiddleware
);

export default googleRouter;
