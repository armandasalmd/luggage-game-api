import { Router } from "express";
import { IRoute } from "@core/interfaces";
import { SearchController } from "../actions/search/SearchController";
import { AddFriendController } from "../actions/addFriend/AddFriendController";
import { FriendsAndInvitesController } from "../actions/friendsAndInvites/FriendsAndInvitesController";
import { RemoveFriendController } from "../actions/removeFriend/RemoveFriendController";
import { RespondInviteController } from "../actions/respondInvite/RespondInviteController";

const FriendsRouter: IRoute = {
  path: "/friends",
  router: Router(),
  authRequired: true,
};

FriendsRouter.router.post("/search", (req, res) => new SearchController().execute(req, res));
FriendsRouter.router.post("/add", (req, res) => new AddFriendController().execute(req, res));
FriendsRouter.router.get("/friendsAndInvites", (req, res) => new FriendsAndInvitesController().execute(req, res));
FriendsRouter.router.delete("/", (req, res) => new RemoveFriendController().execute(req, res));
FriendsRouter.router.post("/respondInvite", (req, res) => new RespondInviteController().execute(req, res));

export { FriendsRouter };