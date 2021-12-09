import { Router } from "express";
import { IRoute } from "@core/interfaces";
import GetGameStateController from "../actions/getGameState/GetGameStateController";

const GameRouter: IRoute = {
  path: "/game",
  router: Router(),
  authRequired: true,
};

GameRouter.router.get("/state", (req, res) => new GetGameStateController().execute(req, res));

export { GameRouter };