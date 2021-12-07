import { Router } from "express";
import { IRoute } from "@core/interfaces";
import CreateLobbyController from "../actions/createLobby/CreateLobbyController";

const LobbyRouter: IRoute = {
  path: "/lobby",
  router: Router(),
  authRequired: true,
};

LobbyRouter.router.post("/", (req, res) => new CreateLobbyController().execute(req, res));

export { LobbyRouter };