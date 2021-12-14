import { IUseCase, Result } from "@core/logic";
import { IGameModel, GameModel, ILobbyModel, LobbyModel } from "@database";
import GetGameStateRequest from "@features/game/models/GetGameStateRequest";
import { GetGameStateResponse } from "@features/game/models/GetGameStateResponse";
import IPublicPlayerState from "@features/game/models/IPublicPlayerState";
import GameUtils from "@utils/Game";

export default class GetGameStateUseCase
  implements IUseCase<GetGameStateRequest, GetGameStateResponse>
{
  async execute(
    request: GetGameStateRequest
  ): Promise<Result<GetGameStateResponse>> {
    const gameModel: IGameModel = await GameModel.findOne({
      roomId: request.roomId,
      "players.username": request.requestingUsername,
      running: true
    });

    if (!gameModel) {
      return Result.fail("Player is not in requested game");
    }

    const player = gameModel.players.find((item) => item.username === request.requestingUsername);

    if (!player) {
      return Result.fail("Cannot create my player state");
    }
    
    const lobby: ILobbyModel = await LobbyModel.findOne({ roomCode: request.roomId });
    
    if (!lobby) {
      return Result.fail("Lobby not found");
    }

    const output: GetGameStateResponse = {
      myState: GameUtils.toMyPlayerState(player),
      gameDetails: GameUtils.toGameDetails(gameModel),
      playersState: this.createOtherPlayerStates(
        gameModel,
        request.requestingUsername
      ),
      lobby
    };

    return Result.ok(output);
  }

  private createOtherPlayerStates(
    model: IGameModel,
    notUsername: string
  ): IPublicPlayerState[] {
    return model.players
      .filter((player) => player.username !== notUsername)
      .map((player) => GameUtils.toPublicPlayerState(player));
  }
}
