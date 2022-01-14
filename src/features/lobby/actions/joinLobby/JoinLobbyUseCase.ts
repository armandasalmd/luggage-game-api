import { IPayload } from "@core/interfaces";
import { IUseCase, Result } from "@core/logic";
import {
  LobbyModel,
  LobbyDocument,
  ILobbyPlayerModel,
  UserModel,
  IUserModel,
  ILobbyModel,
} from "@database";
import { JoinLobbyRequest } from "@features/lobby/models/JoinLobbyRequest";
import { JoinLobbyResult } from "@features/lobby/models/JoinLobbyResult";
import { toPublicGame } from "@utils/Lobby";
import PublicLobbiesManager from "../publicLobbies/PublicLobbiesManager";

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

    if (!(await this.userHasEnoughCoins(lobby.gamePrice, user.username))) {
      return Result.fail(`${lobby.gamePrice} coins are required to join`);
    }

    const existingPlayer = this.findPlayer(lobby.players, user.username);
    if (existingPlayer) {
      this.updatePublicLobbies(lobby);

      return Result.ok({
        joinedPlayer: existingPlayer,
        lobbyState: lobby,
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
    this.updatePublicLobbies(lobby);

    return Result.ok({
      joinedPlayer: lobbyPlayer,
      lobbyState: lobby,
    });
  }

  private updatePublicLobbies(lobby: ILobbyModel) {
    if (!lobby.isPrivate) {
      PublicLobbiesManager.getInstance().update(toPublicGame(lobby));
    }
  }

  private async userHasEnoughCoins(
    gameCost: number,
    username: string
  ): Promise<boolean> {
    const user: IUserModel = await UserModel.findOne({
      username,
    });

    return !!user && user.coins >= gameCost;
  }

  private findPlayer(
    players: ILobbyPlayerModel[],
    username: string
  ): ILobbyPlayerModel {
    return players.find((player) => player.username === username);
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
