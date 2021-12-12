import { IGameModel, IPlayerModel } from "@database";
import IGameDetails from "@features/game/models/IGameDetails";
import IMyPlayerState from "@features/game/models/IMyPlayerState";
import IPublicPlayerState from "@features/game/models/IPublicPlayerState";

enum PlayerState {
  Playing = "playing",
  First = "1st",
  Second = "2nd",
  Third = "3rd",
  Forth = "4th",
  Fifth = "5th",
}

const toGameDetails = (game: IGameModel): IGameDetails => {
  return {
    activeSeatId: game.activeSeatId,
    deadCardsCount: game.deadDeck.length,
    sourceCardsCount: game.sourceDeck.length,
    topPlayCard: game.playDeck[game.playDeck.length - 1] || "",
  };
}

const toMyPlayerState = (player: IPlayerModel): IMyPlayerState => {
  return {
    handCards: player.handCards,
    luggageCards: player.luggageCards,
    playerState: player.playerState,
    seatId: player.seatId,
    lastMoves: player.lastMoves
  };
}

const toPublicPlayerState = (player: IPlayerModel): IPublicPlayerState => {
  return {
    handCardCount: player.handCards.length,
    luggageCards: player.luggageCards,
    playerState: player.playerState,
    seatId: player.seatId,
    username: player.username,
  };
}

export default {
  PlayerState,
  toGameDetails,
  toMyPlayerState,
  toPublicPlayerState
};
