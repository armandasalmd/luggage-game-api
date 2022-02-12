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

FriendsRouter.router.post("/search", new SearchController().toRoute());
FriendsRouter.router.post("/add", new AddFriendController().toRoute());
FriendsRouter.router.get("/friendsAndInvites", new FriendsAndInvitesController().toRoute());
FriendsRouter.router.delete("/", new RemoveFriendController().toRoute());
FriendsRouter.router.post("/respondInvite", new RespondInviteController().toRoute());

export { FriendsRouter };