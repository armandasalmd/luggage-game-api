import "dotenv/config";
import App from "./App";

import { FacebookAuthRouter, GoogleAuthRouter } from "@core/auth/routes";
import { UserRouter, UserPrivateRouter } from "@features/users/router";
import { TestPublicRouter, TestPrivateRouter } from "@features/test/router";
import { LobbyRouter } from "@features/lobby/infra/LobbyHttpRouter";
import { GameRouter } from "@features/game/infra/GameHttpRouter";

// Public routers
const primaryRoutes = [UserRouter, TestPublicRouter, GoogleAuthRouter, FacebookAuthRouter];

// Protected routers
const secondaryRoutes = [LobbyRouter, GameRouter, UserPrivateRouter, TestPrivateRouter];

const app = new App(
  [].concat(primaryRoutes, secondaryRoutes),
  "/api"
);

app.listen();