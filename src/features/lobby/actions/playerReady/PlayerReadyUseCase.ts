import { IPayload } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import { LobbyModel, LobbyDocument } from "@database";
import { PlayerReadyResult } from "@features/lobby/models/PlayerReadyResult";

export default class PlayerReadyUseCase
  implements IUseCase<IPayload, PlayerReadyResult>
{
  async execute(user: IPayload): Promise<Result<PlayerReadyResult>> {
    const lobby: LobbyDocument = await LobbyModel.findOne({
      "players.username": user.username,
    });

    if (!lobby) {
      return Result.fail("Cannot find the lobby");
    }

    const playerIndex = lobby.players.findIndex((player) => {
      return player.username === user.username;
    });

    if (playerIndex < 0) {
      return Result.fail("Play not found in lobby");
    }

    lobby.players[playerIndex].ready = true;
    await lobby.save();

    const isEveryoneReady = lobby.players.every(function (player) {
      return player.ready;
    });

    return Result.ok({
      roomId: lobby.roomCode,
      gameCanStart: isEveryoneReady
    });
  }
}
