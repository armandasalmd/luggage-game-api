import { IAsyncUseCase, Result } from "@core/logic";
import { LobbyModel } from "@database";
import { StartGameUseCase } from "../startGame";

interface PlayAgainQuery {
  username: string;
  lobbyId: string;
}

interface PlayAgainResult {
  gameCanStart: boolean;
}

type UseCase = IAsyncUseCase<PlayAgainQuery, PlayAgainResult>;
type ReturnType = Promise<Result<PlayAgainResult>>;

export class PlayAgainUseCase implements UseCase {
  async execute(data: PlayAgainQuery): ReturnType {
    const lobby = await LobbyModel.findOne({
      roomCode: data.lobbyId
    }, {
      players: 1
    });
    let gameCanStart = false;

    if (!lobby || !Array.isArray(lobby.players)) return Result.fail("Cannot find the lobby");

    const playerIndex = lobby.players.findIndex(p => p.username === data.username);

    if (playerIndex >= 0) {
      lobby.players[playerIndex].ready = true;

      if (lobby.players.every(p => p.ready)) {
        if (await this.startNewRemoveOldGame(data.lobbyId)) {
          gameCanStart = true;
          lobby.state = "gameStarted";
        } else {
          return Result.fail("Cannot restart a game");
        }
      }

      await lobby.save();

      return Result.ok({
        gameCanStart
      });
    }
    
    return Result.fail("Player not found");
  }

  private async startNewRemoveOldGame(lobbyId: string): Promise<boolean> {
    const useCase = new StartGameUseCase();
    const result = await useCase.execute({
      lobbyId
    });

    return result.isSuccess;
  }
}