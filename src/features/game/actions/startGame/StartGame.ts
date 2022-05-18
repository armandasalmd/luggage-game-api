import { Repository } from "redis-om";
import { IAsyncUseCase, Result } from "@core/logic";
import { LobbyModel, ILobbyPlayerModel } from "@database";
import { Deck } from "@utils/Deck";
import GameUtils from "@utils/Game";
import { StartGameQuery } from "./StartGameModels";
import { PlayerModel, getRepositories } from "@databaseRedis";

type UseCase = IAsyncUseCase<StartGameQuery, unknown>;

export class StartGameUseCase implements UseCase {
  async execute(input: StartGameQuery) {
    const { gameRepository, playerRepository } = getRepositories();

    const lobby = await LobbyModel.findOne({ roomCode: input.lobbyId });
    if (!lobby) return Result.fail("Lobby not found");

    // Create random deck
    const sourceDeck = Deck.createShuffledDeck();
    // Init empty game model
    const game = gameRepository.createEntity({
      activeSeatId: 1,
      deadCardsCount: 0,
      gamePrice: lobby.gamePrice,
      gameRules: lobby.gameRules,
      lobbyId: lobby.roomCode,
      playDeck: [],
      seatsDone: "",
      players: lobby.players.map((o) => o.username),
    });

    // Create and save players, deal cards
    for (const player of lobby.players) {
      await this.createAndSavePlayerModel(playerRepository, game.entityId, player, sourceDeck);
    }

    // Save game model
    game.sourceDeck = sourceDeck.cards;
    await gameRepository.save(game);

    return Result.ok();
  }

  private async createAndSavePlayerModel(
    repo: Repository<PlayerModel>,
    gameId: string,
    player: ILobbyPlayerModel,
    playDeck: Deck
  ) {
    return await repo.createAndSave({
      gameId,
      handCards: playDeck.take(3),
      luggageCards: new Deck(playDeck.take(6)).toString(),
      seatId: player.seatId,
      submitQueue: [],
      status: GameUtils.PlayerState.Playing,
      username: player.username,
    });
  }
}
