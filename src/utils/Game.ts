import { GameModel, PlayerModel } from "@databaseRedis";
import { IFullGameModel, IGameDetails, IMyPlayerState, IPublicPlayerState } from "@features/game/models";

export enum PlayerState {
  Playing = "playing",
  Surrendered = "surrendered",
  First = "1st",
  Second = "2nd",
  Third = "3rd",
  Forth = "4th",
  Fifth = "5th",
}

const toFullGame = (game: GameModel, players: PlayerModel[]): IFullGameModel => {
  return {
    activeSeatId: game.activeSeatId,
    gameId: game.entityId,
    deadCardsCount: game.deadCardsCount,
    gamePrice: game.gamePrice,
    gameRules: game.gameRules,
    players: players.map((o) => ({
      username: o.username,
      status: o.status,
      gameId: game.entityId,
      handCards: o.handCards,
      seatId: o.seatId,
      entityId: o.entityId,
      luggageCards: o.luggageCards,
      submitQueue: o.submitQueue,
    })),
    seatsDone: game.seatsDone,
    lobbyId: game.lobbyId,
    playDeck: game.playDeck,
    sourceDeck: game.sourceDeck,
  };
};

const toGameDetails = (game: GameModel, includePlayDeck: boolean): IGameDetails => {
  return {
    activeSeatId: game.activeSeatId,
    deadCardsCount: game.deadCardsCount,
    gameId: game.entityId,
    playDeck: includePlayDeck ? game.playDeck : undefined,
    sourceDeckCount: game.sourceDeck.length,
    price: game.gamePrice,
    rules: game.gameRules,
  };
};

const toMyPlayerState = (player: PlayerModel): IMyPlayerState => {
  return {
    handCards: player.handCards,
    luggageCards: player.luggageCards,
    seatId: player.seatId,
    status: player.status,
    submitQueue: player.submitQueue,
  };
};

const toPublicPlayerState = (player: PlayerModel): IPublicPlayerState => {
  return {
    handCardCount: player.handCards.length,
    luggageCards: player.luggageCards,
    status: player.status,
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
  const reward = (winnable * (playersCount - place)) / arithmeticSum(playersCount);

  return Math.round(reward);

  function arithmeticSum(n: number): number {
    return (n * (n - 1)) / 2;
  }
};

const getSurrenderReward = (gamePrice: number, playerCount: number) => {
  return Math.round((gamePrice * 0.95) / (playerCount - 1));
};

export default {
  PlayerState,
  getPlayerPlace,
  getReward,
  getSurrenderReward,
  toFullGame,
  toGameDetails,
  toMyPlayerState,
  toPublicPlayerState,
};
