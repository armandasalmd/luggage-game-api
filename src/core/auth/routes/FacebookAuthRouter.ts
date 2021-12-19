import { Router } from "express";
import passport from "passport";

import { IRoute } from "@core/interfaces";
import { PassportConfig } from "@core/config";
import SocialAuthMiddleware from "../SocialAuthMiddleware";

const passportConfig = new PassportConfig();
const facebookRouter: IRoute = {
  path: "/facebook",
  router: Router(),
  authRequired: false,
};

facebookRouter.router.get(
  "/",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

facebookRouter.router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: passportConfig.getFailureUrl(
      "Failed to authenticate, Try logging in with Google"
    ),
  }),
  SocialAuthMiddleware
);

export default facebookRouter;