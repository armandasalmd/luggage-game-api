import { IPayload } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import { LobbyModel, LobbyDocument, LobbyPlayerDocument } from "@database";
import { LeaveLobbyResult } from "@features/lobby/models/LeaveLobbyResult";

export default class LeaveLobbyUseCase
  implements IUseCase<IPayload, LeaveLobbyResult>
{
  async execute(user: IPayload): Promise<Result<LeaveLobbyResult>> {
    const activeLobbies: LobbyDocument[] = await LobbyModel.find({
      "players.username": user.username,
    });

    if (!activeLobbies || activeLobbies.length === 0) {
      return Result.fail("No active lobbies found");
    }

    const roomIds = activeLobbies.map((lobby) => lobby.roomCode);

    for (const lobby of activeLobbies) {
      const leavingPlayer = lobby.players.find(
        (player) => player.username === user.username
      ) as LobbyPlayerDocument;

      if (leavingPlayer) {
        await leavingPlayer.remove();
        await lobby.save();
      } else {
        return Result.fail("Player not found");
      }

      // remove lobby if no players left
      if (lobby.players.length === 0) {
        await lobby.remove();
      }
    }

    return Result.ok({
      lobbyLeftIds: roomIds,
      usernameLeft: user.username,
    });
  }
}
