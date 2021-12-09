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
      if (lobby.state !== "active") {
        continue;
      }

      const leavingPlayer = lobby.players.find(
        (player) => player.username === user.username
      ) as LobbyPlayerDocument;

      // if last remaining player - remove lobby entirely
      if (lobby.players.length === 1) {
        await lobby.remove();
        continue;
      }

      if (leavingPlayer) {
        await leavingPlayer.remove();

        // reset everyones ready state
        for (const player of lobby.players) {
          player.ready = false;
        }
      } else {
        return Result.fail("Player not found");
      }

      await lobby.save();
    }

    return Result.ok({
      lobbyLeftIds: roomIds,
      usernameLeft: user.username,
    });
  }
}
