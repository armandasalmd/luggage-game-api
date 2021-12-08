import { IPayload } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import { LobbyModel, LobbyDocument, ILobbyPlayerModel } from "@database";
import { JoinLobbyRequest } from "@features/lobby/models/JoinLobbyRequest";
import { JoinLobbyResult } from "@features/lobby/models/JoinLobbyResult";

export default class JoinLobbyUseCase
  implements IUseCase<JoinLobbyRequest, JoinLobbyResult>
{
  async execute(
    request: JoinLobbyRequest,
    user: IPayload
  ): Promise<Result<JoinLobbyResult>> {
    const lobby: LobbyDocument = await LobbyModel.findOne({
      roomCode: request.roomId,
    });

    if (!lobby) {
      return Result.fail("Lobby not found");
    }

    if (lobby.state !== "active") {
      return Result.fail("Game started or finished");
    }

    if (lobby.players.length >= lobby.playerCount) {
      return Result.fail("Lobby is full");
    }

    const existingPlayer = this.findPlayer(lobby.players, user.username);
    if (existingPlayer) {
      return Result.ok({
        joinedPlayer: existingPlayer,
        lobbyState: lobby
      });
    }

    const lobbyPlayer: ILobbyPlayerModel = {
      avatar: user.avatar,
      username: user.username,
      ready: false,
      seatId: this.getAvailableSeat(lobby.players, lobby.playerCount),
    };

    lobby.players.push(lobbyPlayer);
    await lobby.save();

    return Result.ok({
      joinedPlayer: lobbyPlayer,
      lobbyState: lobby
    });
  }

  private findPlayer(
    players: ILobbyPlayerModel[],
    username: string
  ): ILobbyPlayerModel {
    return players.find((player) => {
      return player.username === username;
    });
  }

  private getAvailableSeat(
    players: ILobbyPlayerModel[],
    maxSeats: number
  ): number {
    const taken = players.map((player) => player.seatId);

    for (let i = 1; i <= maxSeats; i++) {
      if (!taken.includes(i)) {
        return i;
      }
    }
  }
}
