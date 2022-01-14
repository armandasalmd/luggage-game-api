import { IPayload } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import { LobbyModel, LobbyDocument, LobbyPlayerDocument } from "@database";
import { LeaveLobbyResult } from "@features/lobby/models/LeaveLobbyResult";
import { toPublicGame } from "@utils/Lobby";
import PublicLobbiesManager from "../publicLobbies/PublicLobbiesManager";

export default class LeaveLobbyUseCase implements IUseCase<IPayload, LeaveLobbyResult> {
  async execute(user: IPayload): Promise<Result<LeaveLobbyResult>> {
    const activeLobbies: LobbyDocument[] = await LobbyModel.find({
      "players.username": user.username,
      state: "active",
    });

    if (!activeLobbies || activeLobbies.length === 0) {
      return Result.fail("No active lobbies found");
    }

    for (const lobby of activeLobbies) {
      const leavingPlayer = lobby.players.find(
        (player) => player.username === user.username
      ) as LobbyPlayerDocument;

      // if last remaining player - remove lobby entirely
      if (lobby.players.length === 1) {
        if (!lobby.isPrivate) {
          PublicLobbiesManager.getInstance().remove(lobby.roomCode);
        }

        await lobby.remove();
        continue;
      }

      if (leavingPlayer) {
        await leavingPlayer.remove();
        
        if (!lobby.isPrivate) {
          PublicLobbiesManager.getInstance().update(toPublicGame(lobby));
        }

        // reset everyones ready state
        for (const player of lobby.players) {
          player.ready = false;
        }
      } else {
        return Result.fail("Player not found");
      }

      await lobby.save();
    }

    const roomIds = activeLobbies.map((lobby) => lobby.roomCode);

    return Result.ok({
      lobbyLeftIds: roomIds,
      usernameLeft: user.username,
    });
  }
}
