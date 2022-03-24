import { Router } from "express";
import { IRoute } from "@core/interfaces";
import GetGameStateController from "../actions/getGameState/GetGameStateController";
import GetRunningGameController from "../actions/getRunningGame/GetRunningGameController";
import { HistoryController } from "../actions/history/HistoryController";

const GameRouter: IRoute = {
  path: "/game",
  router: Router(),
  authRequired: true,
};

GameRouter.router.post("/getState", new GetGameStateController().toRoute());
GameRouter.router.get("/findActive", new GetRunningGameController().toRoute());
GameRouter.router.post("/history", new HistoryController().toRoute());

export { GameRouter };