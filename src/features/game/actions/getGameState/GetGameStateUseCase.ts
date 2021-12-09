import { IUseCase, Result } from "@core/logic";
import { IGameModel, IPlayerModel, GameModel, ILobbyModel, LobbyModel } from "@database";
import GetGameStateRequest from "@features/game/models/GetGameStateRequest";
import { GetGameStateResponse } from "@features/game/models/GetGameStateResponse";
import IGameDetails from "@features/game/models/IGameDetails";
import IMyPlayerState from "@features/game/models/IMyPlayerState";
import IPublicPlayerState from "@features/game/models/IPublicPlayerState";

export default class GetGameStateUseCase
  implements IUseCase<GetGameStateRequest, GetGameStateResponse>
{
  async execute(
    request: GetGameStateRequest
  ): Promise<Result<GetGameStateResponse>> {
    const gameModel: IGameModel = await GameModel.findOne({
      roomId: request.roomId,
      "players.username": request.requestingUsername,
    });

    if (!gameModel) {
      return Result.fail("Player is not in requested game");
    }

    const myPlayerState = this.createMyPlayerState(
      gameModel,
      request.requestingUsername
    );

    if (!myPlayerState) {
      return Result.fail("Cannot create my player state");
    }
    
    const lobby: ILobbyModel = await LobbyModel.findOne({ roomCode: request.roomId });
    
    if (!lobby) {
      return Result.fail("Lobby not found");
    }

    const output: GetGameStateResponse = {
      myState: myPlayerState,
      gameDetails: this.createGameDetails(gameModel),
      playersState: this.createOtherPlayerStates(
        gameModel,
        request.requestingUsername
      ),
      lobby
    };

    return Result.ok(output);
  }

  private createGameDetails(model: IGameModel): IGameDetails {
    return {
      activeSeatId: model.activeSeatId,
      deadCardsCount: model.deadDeck.length,
      sourceCardsCount: model.sourceDeck.length,
      topPlayCard: model.playDeck[model.playDeck.length - 1] || "",
    };
  }

  private createMyPlayerState(
    model: IGameModel,
    username: string
  ): IMyPlayerState | undefined {
    const player = model.players.find((item) => item.username === username);

    if (!player) return undefined;

    return {
      seatId: player.seatId,
      handCards: player.handCards,
      luggageCards: player.luggageCards,
      playerState: player.playerState,
    };
  }

  private createOtherPlayerStates(
    model: IGameModel,
    notUsername: string
  ): IPublicPlayerState[] {
    return model.players
      .filter((player) => player.username !== notUsername)
      .map((player) => this.createPublicPlayerState(player));
  }

  private createPublicPlayerState(player: IPlayerModel): IPublicPlayerState {
    return {
      handCardCount: player.handCards.length,
      luggageCards: player.luggageCards,
      playerState: player.playerState,
      seatId: player.seatId,
      username: player.username,
    };
  }
}
