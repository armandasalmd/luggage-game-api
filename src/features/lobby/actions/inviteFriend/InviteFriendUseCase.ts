import { IPayload } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import {
  FriendModel,
  ILobbyInviteModel,
  ILobbyModel,
  LobbyDocument,
  LobbyInviteState,
  LobbyModel,
} from "@database";
import { InviteFriendRequest } from "@features/lobby/models/InviteFriendRequest";
import { InviteFriendResult } from "@features/lobby/models/InviteFriendResult";
import { INotification, LobbyMetaData } from "@features/notifications/models/INotification";
import { escapeRegExp } from "@utils/Global";

export default class InviteFriendUseCase
  implements IUseCase<InviteFriendRequest, InviteFriendResult>
{
  async execute(req: InviteFriendRequest, user: IPayload): Promise<Result<InviteFriendResult>> {
    if (!(await this.isFriend(req.username, user.username))) {
      return Result.fail(req.username + " is not your friend");
    }

    const usernameReg = new RegExp("^" + escapeRegExp(req.username) + "$");
    const lobby: LobbyDocument = await LobbyModel.findOne({
      state: "active",
      "players.username": { $not: usernameReg },
    });

    if (lobby == null) {
      return Result.fail("Lobby not found");
    }

    if (lobby.invites?.find((item) => item.username === req.username) ?? false) {
      return Result.ok();
    }

    const invite: ILobbyInviteModel = {
      state: LobbyInviteState.Pending,
      username: req.username,
      senderUsername: user.username,
      dateCreated: new Date(),
    };

    if (Array.isArray(lobby.invites)) {
      lobby.invites.push(invite);
    } else {
      lobby.invites = [invite];
    }

    await lobby.save();

    return Result.ok({
      notification: this.createNotification(invite, lobby),
    });
  }

  private async isFriend(name1: string, name2: string): Promise<boolean> {
    return await FriendModel.exists({
      $or: [
        { username1: name1, username2: name2 },
        { username1: name2, username2: name1 },
      ],
    });
  }

  private createNotification(invite: ILobbyInviteModel, lobby: ILobbyModel): INotification {
    const description = invite.senderUsername + " has invited you to join " + lobby.gameRules + " game lobby";
    const metaData: LobbyMetaData = {
      players: lobby.players?.length ?? 0,
      playersMax: lobby.playerCount,
      price: lobby.gamePrice,
      roomId: lobby.roomCode
    };

    return {
      date: invite.dateCreated,
      description,
      title: "Lobby invite",
      type: "lobbyInvite",
      metaData,
    };
  }
}
