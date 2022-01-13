import { IUseCase, Result } from "@core/logic";
import {
  LobbyModel,
  IGameModel,
  IPlayerModel,
  ILobbyPlayerModel,
  GameModel
} from "@database";
import { Deck } from "@utils/Deck";
import GameUtils from "@utils/Game";

export default class StartGameUseCase
  implements IUseCase<string, void>
{
  async execute(roomId: string): Promise<Result<void>> {
    // Find game lobby details
    const lobby = await LobbyModel.findOne({ roomCode: roomId });

    if (!lobby) {
      return Result.fail("Lobby not found");
    }

    // Create random deck
    const sourceDeck = Deck.createShuffledDeck();
    const playerModels: IPlayerModel[] = [];

    // Deal cards to players
    lobby.players.forEach((player) =>
      playerModels.push(this.createPlayerModel(player, sourceDeck))
    );

    // Create game model
    const gameModelTemplate: IGameModel = {
      deadDeck: [],
      playDeck: [],
      sourceDeck: sourceDeck.cards,
      running: true,
      activeSeatId: 1,
      players: playerModels,
      rulesMode: lobby.gameRules,
      roomId,
      gamePrice: lobby.gamePrice,
      gameStartDate: new Date()
    };

    const gameModel = new GameModel(gameModelTemplate);

    await gameModel.save();

    return Result.ok();
  }

  private createPlayerModel(
    player: ILobbyPlayerModel,
    playDeck: Deck
  ): IPlayerModel {
    return {
      username: player.username,
      seatId: player.seatId,
      luggageCards: new Deck(playDeck.take(6)).toString(),
      handCards: playDeck.take(3),
      playerState: GameUtils.PlayerState.Playing,
      lastMoves: []
    };
  }
}
