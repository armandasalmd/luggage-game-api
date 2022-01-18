import { Router } from "express";
import { IRoute } from "@core/interfaces";
import CreateLobbyController from "../actions/createLobby/CreateLobbyController";
import PublicLobbiesController from "../actions/publicLobbies/PublicLobbiesController";
import { InviteFriendController } from "../actions/inviteFriend/InviteFriendController";

const LobbyRouter: IRoute = {
  path: "/lobby",
  router: Router(),
  authRequired: true,
};

LobbyRouter.router.post("/", (req, res) => new CreateLobbyController().execute(req, res));
LobbyRouter.router.post("/getPublic", (req, res) => new PublicLobbiesController().execute(req, res));
LobbyRouter.router.post("/inviteFriend", (req, res) => new InviteFriendController().execute(req, res));

export { LobbyRouter };