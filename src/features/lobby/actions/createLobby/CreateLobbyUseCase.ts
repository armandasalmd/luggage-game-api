import { IUseCase, Result } from "@core/logic";
import { CreateLobbyRequest } from "@features/lobby/models/CreateLobbyRequest";
import { CreateLobbyResponse } from "@features/lobby/models/CreateLobbyResponse";
import {
  ILobbyModel,
  ILobbyPlayerModel,
  LobbyModel,
  UserModel,
  IUserModel,
} from "@database";
import { IPayload } from "@core/interfaces";
import { genRoomCode } from "@utils/Lobby";

export default class CreateLobbyUseCase implements IUseCase<CreateLobbyRequest, CreateLobbyResponse>
{
  async execute(req: CreateLobbyRequest, user: IPayload): Promise<Result<CreateLobbyResponse>> {

    if (!(await this.userHasEnoughCoins(req.gamePrice, user.username))) {
      return Result.fail("Not enough coins to start the game");
    }

    const creatorPlayer: ILobbyPlayerModel = {
      avatar: user.avatar,
      username: user.username,
      ready: false,
      seatId: 1,
    };

    let roomCode: string;
    let loopProtector = 0;

    do {
      roomCode = genRoomCode();
      loopProtector++;
    } while ((await this.codeExists(roomCode)) && loopProtector < 10);

    if (loopProtector === 10) {
      return Result.fail("Cannot assign room code");
    }

    const lobbyDetails: ILobbyModel = {
      playerCount: req.playerCount,
      gamePrice: req.gamePrice,
      isPrivate: req.isPrivate,
      gameRules: req.gameRules,
      state: "active",
      roomCode,
      players: [creatorPlayer],
    };

    try {
      const lobby = new LobbyModel(lobbyDetails);
      const lobbyResult = await lobby.save();

      if (lobbyResult) {
        return Result.ok<CreateLobbyResponse>({
          roomCode: lobbyResult.roomCode,
          players: [creatorPlayer],
        });
      } else {
        return Result.fail("Cannot create lobby");
      }
    } catch {
      return Result.fail("Cannot create lobby");
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

  private async codeExists(roomCode: string): Promise<boolean> {
    return !!(await LobbyModel.findOne({ roomCode }));
  }
}
