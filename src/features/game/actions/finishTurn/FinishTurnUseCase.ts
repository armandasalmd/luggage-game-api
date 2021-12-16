import { IUseCase, Result } from "@core/logic";
import {
  GameDocument,
  GameModel,
  IGameModel,
  IPlayerModel,
  LobbyDocument,
  LobbyModel,
} from "@database";
import { FinishTurnQuery } from "@features/game/models/FinishTurnQuery";
import {
  Looser,
  FinishTurnResult,
} from "@features/game/models/FinishTurnResult";
import GameUtils from "@utils/Game";
import { Deck } from "@utils/Deck";
import AddCoinsUseCase from "@features/users/actions/addCoins/AddCoinsUseCase";

export default class FinishTurnUseCase
  implements IUseCase<FinishTurnQuery, FinishTurnResult>
{
  async execute(query: FinishTurnQuery): Promise<Result<FinishTurnResult>> {
    const game: GameDocument = await GameModel.findOne({
      roomId: query.roomId,
      "players.username": query.username,
    });

    if (!game) return Result.fail("Game not found");

    game.activeSeatId = this.getNextSeatId(game);

    const player = game.players.find(
      (item) => item.username === query.username
    );

    if (!player) return Result.fail("Player not found");

    this.checkAndApplyTakehome(game, player);
    this.drawCardsIfNeeded(game, player);

    let reward: number | undefined; // unset means game continues

    if (player.luggageCards === ",,,,," && player.handCards.length === 0) {
      const place = this.playerFinished(game, player);
      reward = GameUtils.getReward(game.gamePrice, game.players.length, place);

      const addCoinsUseCase = new AddCoinsUseCase();
      const addCoinsResult = await addCoinsUseCase.execute({
        amount: reward,
        username: player.username,
      });

      if (addCoinsResult.isFailure) console.warn(addCoinsResult.error.message);
    }

    const gameFinished = this.gameFinished(game);
    let looser: Looser | undefined;

    if (gameFinished) {
      game.running = false;
      game.activeSeatId = 0;

      const lobby: LobbyDocument = await LobbyModel.findOne(
        {
          roomCode: query.roomId,
        },
        { state: 1 }
      );

      if (lobby) {
        lobby.state = "gameFinished";
        await lobby.save();
      }

      looser = await this.chargeLooser(game);
    }

    await game.save();

    return Result.ok({
      gameDetails: GameUtils.toGameDetails(game),
      myState: GameUtils.toMyPlayerState(player),
      myPublicState:
        reward !== undefined
          ? GameUtils.toPublicPlayerState(player)
          : undefined,
      finishReward: reward,
      looser,
    });
  }

  private drawCardsIfNeeded(game: IGameModel, player: IPlayerModel) {
    if (player.handCards.length < 3) {
      const sourceDeck = new Deck([...game.sourceDeck]);
      const newCards = sourceDeck.take(3 - player.handCards.length);

      player.handCards.push(...newCards);
      game.sourceDeck = sourceDeck.cards;
    }
  }

  private checkAndApplyTakehome(game: IGameModel, player: IPlayerModel) {
    if (player.lastMoves.length === 0) {
      player.handCards.push(...game.playDeck);
      game.playDeck = [];
    }

    player.lastMoves = [];
  }

  private getNextSeatId(game: IGameModel): number {
    const seatIds = game.players
      .filter((item) => item.playerState === "playing")
      .map((item) => item.seatId)
      .sort();

    const activeIdx = seatIds.findIndex((id) => id === game.activeSeatId);

    return activeIdx === seatIds.length - 1
      ? seatIds[0]
      : seatIds[activeIdx + 1];
  }

  private playerFinished(game: IGameModel, player: IPlayerModel): number {
    const place =
      game.players.length -
      game.players.filter((item) => item.playerState === "playing").length +
      1;

    player.playerState = GameUtils.getPlayerPlace(place);

    return place;
  }

  private gameFinished(game: IGameModel): boolean {
    return (
      game.players.filter((item) => item.playerState === "playing").length <= 1
    );
  }

  private async chargeLooser(game: IGameModel): Promise<Looser> {
    const looser = game.players.find((item) => item.playerState === "playing");

    if (looser) {
      const addCoinsUseCase = new AddCoinsUseCase();
      await addCoinsUseCase.execute({
        amount: -game.gamePrice,
        username: looser.username,
      });
    } else {
      console.warn("Looser cannot be charged. Not found");
    }

    return {
      price: game.gamePrice,
      username: looser.username,
    };
  }
}
