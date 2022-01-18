import { IPayload } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import {
  FriendModel,
  ILobbyInviteModel,
  LobbyDocument,
  LobbyInviteState,
  LobbyModel,
} from "@database";
import { InviteFriendRequest } from "@features/lobby/models/InviteFriendRequest";
import { escapeRegExp } from "@utils/Global";

export default class InviteFriendUseCase implements IUseCase<InviteFriendRequest, void> {
  async execute(req: InviteFriendRequest, user: IPayload): Promise<Result<void>> {

    if (!(await this.isFriend(req.username, user.username))) {
      return Result.fail(req.username + " is not your friend");
    }

    const usernameReg = new RegExp("^" + escapeRegExp(req.username) + "$");
    const lobby: LobbyDocument = await LobbyModel.findOne({
      state: "active",
      "players.username": { $not: usernameReg },
    }, {
      invites: 1
    });

    if (lobby == null) {
      return Result.fail("Lobby not found");
    }

    if (lobby.invites?.find(item => item.username === req.username) ?? false) {
      return Result.ok();
    }

    const invite: ILobbyInviteModel = {
      state: LobbyInviteState.Pending,
      username: req.username,
    };

    if (Array.isArray(lobby.invites)) {
      lobby.invites.push(invite);
    } else {
      lobby.invites = [invite];
    }

    await lobby.save();

    return Result.ok();
  }

  async isFriend(name1: string, name2: string): Promise<boolean> {
    return await FriendModel.exists({
      $or: [
        { username1: name1, username2: name2 },
        { username1: name2, username2: name1 },
      ],
    });
  }
}
