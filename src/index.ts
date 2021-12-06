import "dotenv/config";
import App from "./App";

import { UserRouter, UserPrivateRouter } from "@features/users/router";
import { TestPublicRouter, TestPrivateRouter } from "@features/test/router";

const primaryRoutes = [UserRouter, TestPublicRouter];
const secondaryRoutes = [TestPrivateRouter, UserPrivateRouter];

const app = new App(
  [].concat(primaryRoutes, secondaryRoutes),
  "/api"
);

app.listen();