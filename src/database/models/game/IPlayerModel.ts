export default interface IPlayerModel {
  username: string;
  seatId: number;
  luggageCards: string;
  handCards: string[];
  playerState: string;
  lastMoves: string[];
}