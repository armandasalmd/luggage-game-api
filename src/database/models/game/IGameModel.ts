import IPlayerModel from "./IPlayerModel";

export default interface IGameModel {
  deadDeck: string[];
  playDeck: string[];
  sourceDeck: string[];
  running: boolean;
  activeSeatId: number;
  players: IPlayerModel[];
  roomId: string;
}