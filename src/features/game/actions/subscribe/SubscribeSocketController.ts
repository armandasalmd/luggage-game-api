import { SocketController } from "@core/socket";
import { GetRunningGameIdUseCase } from "../getRunningGameId";
import { GetGameStateUseCase } from "../getGameState";
import { IPublicPlayerState } from "@features/game/models";
import { DisconnectUseCase } from "../disconnect";

export class SubscribeSocketController extends SocketController<void> {
  protected async executeImpl(): Promise<any> {
    const username = this.user.username;
    const useCase = new GetRunningGameIdUseCase();
    const result = await useCase.execute(username);
    
    if (result.isFailure) return { success: false };
    
    /* TODO: In API, SubscribeSocketController.ts, dont call 
    GetRunningGameIdUseCase as it makes 2 requests to Redis database. 
    Do it only once. Can try benchmarking to see the difference */
    const useCase2 = new GetGameStateUseCase();
    const result2 = await useCase2.execute({
      gameId: result.value.gameId,
      username
    });

    if (result2.isFailure) return { success: false };

    this.payloadGameId = result.value.gameId;
    this.payloadLobbyId = result.value.lobbyId;
    // this.socket.rooms
    this.joinRoom(result.value.gameId);

    await this.changeConnectState(result.value.gameId, username);

    return {
      success: true,
      gameState: result2.value
    };
  }

  private async changeConnectState(gameId: string, username: string) {
    const useCase = new DisconnectUseCase();
    const result = await useCase.execute({
      connected: true,
      gameId,
      username
    });

    if (result.isSuccess) {
      this.emitToRoom(gameId, "game public player changed", {
        username,
        connected: true
      } as Partial<IPublicPlayerState>);
    }
  }
}
