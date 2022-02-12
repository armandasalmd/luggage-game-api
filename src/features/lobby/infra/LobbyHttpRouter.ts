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

LobbyRouter.router.post("/", new CreateLobbyController().toRoute());
LobbyRouter.router.post("/getPublic", new PublicLobbiesController().toRoute());
LobbyRouter.router.post("/inviteFriend", new InviteFriendController().toRoute());

export { LobbyRouter };