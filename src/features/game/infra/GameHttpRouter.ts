import { Router } from "express";
import { IRoute } from "@core/interfaces";
import GetGameStateController from "../actions/getGameState/GetGameStateController";
import GetRunningGameController from "../actions/getRunningGame/GetRunningGameController";

const GameRouter: IRoute = {
  path: "/game",
  router: Router(),
  authRequired: true,
};

GameRouter.router.post("/getState", (req, res) => new GetGameStateController().execute(req, res));
GameRouter.router.get("/findActive", (req, res) => new GetRunningGameController().execute(req, res));

export { GameRouter };