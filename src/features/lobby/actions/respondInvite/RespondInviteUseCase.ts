import { FilterQuery } from "mongoose";

import { RespondInviteRequest } from "../../models/RespondInviteRequest";
import { IUseCase, Result } from "@core/logic";
import { LobbyModel, LobbyDocument, LobbyInviteState } from "@database";
import { IPayload, IHttpError } from "@core/interfaces";

export class RespondInviteUseCase implements IUseCase<RespondInviteRequest, void> {
  async execute(query: RespondInviteRequest, user: IPayload): Promise<Result<void>> {
    const filter: FilterQuery<LobbyDocument> = {
      "invites.username": user.username,
      "invites.status": LobbyInviteState.Pending,
      roomCode: query.roomCode
    };

    try {
      const lobby = await LobbyModel.findOne(filter, {
        invites: 1
      });

      if (!lobby) return Result.fail({
        message: "Lobby not found",
        statusCode: 404
      } as IHttpError);

      // if (query.accept) {
      //   const invite = lobby.invites.find((item) => item.username === user.username);

      //   invite.state = LobbyInviteState.Accepted;
      // } else {
      // }
      lobby.invites = lobby.invites.filter((item) => item.username !== user.username);

      await lobby.save();
    } catch {
      return Result.fail("Cannot respond to invite");
    }

    return Result.ok();
  }
}
