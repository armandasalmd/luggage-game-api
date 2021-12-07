import "dotenv/config";
import App from "./App";

import { UserRouter, UserPrivateRouter } from "@features/users/router";
import { TestPublicRouter, TestPrivateRouter } from "@features/test/router";
import { LobbyRouter } from "@features/lobby/router";

// Public routers
const primaryRoutes = [UserRouter, TestPublicRouter];

// Protected routers
const secondaryRoutes = [LobbyRouter, UserPrivateRouter, TestPrivateRouter];

const app = new App(
  [].concat(primaryRoutes, secondaryRoutes),
  "/api"
);

app.listen();