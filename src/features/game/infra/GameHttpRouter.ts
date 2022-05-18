import { Router } from "express";
import { IRoute } from "@core/interfaces";
import { ClearCacheController } from "../actions/clearCache";
import { GetRunningGameIdController } from "../actions/getRunningGameId";
import { GetGameStateController } from "../actions/getGameState";
import { HistoryController } from "../actions/getHistory";

const GameRouter: IRoute = {
  path: "/game",
  router: Router(),
  authRequired: true,
};

GameRouter.router.delete("/cache", new ClearCacheController().toRoute());
GameRouter.router.get("/findActive", new GetRunningGameIdController().toRoute());
GameRouter.router.post("/getState", new GetGameStateController().toRoute());
GameRouter.router.post("/history", new HistoryController().toRoute());

export { GameRouter };