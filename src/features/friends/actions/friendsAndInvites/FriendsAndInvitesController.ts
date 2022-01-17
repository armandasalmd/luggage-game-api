import { HttpController, IUserRequest } from "@core/logic";
import { FriendsAndInvitesResponse } from "@features/friends/models/FriendsAndInvitesResponse";
import { GetFriendsUseCase } from "../getFriends/GetFriendsUseCase";
import { GetInvitesUseCase } from "../getInvites/GetInvitesUseCase";

export class FriendsAndInvitesController extends HttpController {
  protected async executeImpl(req: IUserRequest<void>): Promise<void> {
    const friendsUseCase = new GetFriendsUseCase();
    const friends = await friendsUseCase.execute({
      forUsername: req.user.username,
      includeAvatar: true,
      includePending: false,
    });

    if (friends.isFailure) {
      this.fail("Friends cannot be fetched");
      return;
    }

    const invitesUseCase = new GetInvitesUseCase();
    const invites = await invitesUseCase.execute(req.user.username);

    if (invites.isFailure) {
      this.fail("Invites cannot be fetched");
      return;
    }

    this.json(200, {
      friends: friends.value.friends,
      invites: invites.value.invites,
    } as FriendsAndInvitesResponse);
  }
}
