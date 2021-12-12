import { IUseCase, Result } from "@core/logic";
import { GameDocument, GameModel, IGameModel, IPlayerModel } from "@database";
import { FinishTurnQuery } from "@features/game/models/FinishTurnQuery";
import { FinishTurnResult } from "@features/game/models/FinishTurnResult";
import GameUtils from "@utils/Game";
import { Deck } from "@utils/Deck";

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

    await game.save();

    return Result.ok({
      gameDetails: GameUtils.toGameDetails(game),
      myState: GameUtils.toMyPlayerState(player)
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
}
