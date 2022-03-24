import { IUseCase, Result } from "@core/logic";
import { NotificationsResult } from "@features/notifications/models/NotificationsResult";
import { LobbyModel, ILobbyModel, ILobbyInviteModel } from "@database";
import { INotification } from "@features/notifications/models/INotification";

interface IAggregateLobbyInvite {
  roomCode: string;
  playerCount: number;
  playersNow: number;
  gamePrice: number;
  gameRules: string;
  invite: ILobbyInviteModel
}

export default class LobbyNotificationsUseCase implements IUseCase<string, NotificationsResult> {
  async execute(username: string): Promise<Result<NotificationsResult>> {
    let invites: IAggregateLobbyInvite[] = [];

    try {
      invites = await LobbyModel.aggregate([
        {
          $match: {
            "invites.username": username,
            "invites.state": "pending",
            state: "active"
          }
        },
        {
          $addFields: {
            playersNow: { $size:  "$players" },
            invite: {
              $filter: {
                input: "$invites",
                as: "i",
                cond: { $eq: ["$$i.username", username] }
              }
            }
          }
        },
        { $unwind: { path: "$invite" } },
        {
          $project: { 
            roomCode: 1,
            playerCount: 1,
            playersNow: 1,
            gamePrice: 1,
            gameRules: 1,
            invite: 1
          }
        }
      ]);
    } catch {
      return Result.fail("Cannot execute database request");
    }

    return Result.ok({
      notifications: invites.map(this.toNotification)
    });
  }

  private toNotification(invite: IAggregateLobbyInvite): INotification {
    const description = invite.invite.senderUsername + " has invited you to join " + invite.gameRules + " game lobby";

    return {
      date: invite.invite.dateCreated,
      description,
      title: "Lobby invite",
      type: "lobbyInvite",
      metaData: {
        players: invite.playersNow,
        playersMax: invite.playerCount,
        price: invite.gamePrice,
        roomId: invite.roomCode
      }
    };
  }
}
