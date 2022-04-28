import { IGameModel, IPlayerModel } from "@database";
import IGameDetails from "@features/game/models/IGameDetails";
import IMyPlayerState from "@features/game/models/IMyPlayerState";
import IPublicPlayerState from "@features/game/models/IPublicPlayerState";

enum PlayerState {
  Playing = "playing",
  Surrendered = "surrendered",
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
};

const toMyPlayerState = (player: IPlayerModel): IMyPlayerState => {
  return {
    handCards: player.handCards,
    luggageCards: player.luggageCards,
    playerState: player.playerState,
    seatId: player.seatId,
    lastMoves: player.lastMoves,
  };
};

const toPublicPlayerState = (player: IPlayerModel): IPublicPlayerState => {
  return {
    handCardCount: player.handCards.length,
    luggageCards: player.luggageCards,
    playerState: player.playerState,
    seatId: player.seatId,
    username: player.username,
  };
};

const getPlayerPlace = (place: number): string => {
  const dict = ["1st", "2nd", "3rd", "4th", "5th"];

  return dict[place - 1];
};

const getReward = (gamePrice: number, playersCount: number, place: number) => {
  const winnable = gamePrice * 0.95;
  const reward = winnable * (playersCount - place) / arithmeticSum(playersCount);

  return Math.round(reward);

  function arithmeticSum(n: number): number {
    return n * (n - 1) / 2;
  }
};

const getSurrenderReward = (gamePrice: number, playerCount: number) => {  
  return Math.round(gamePrice * 0.95 / (playerCount - 1));
};

export default {
  PlayerState,
  getPlayerPlace,
  getReward,
  getSurrenderReward,
  toGameDetails,
  toMyPlayerState,
  toPublicPlayerState,
};
