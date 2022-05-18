import { GameModelProps, PlayerModelProps } from "@databaseRedis";

export interface IFullGameModel extends Omit<GameModelProps, "players"> {
  gameId: string;
  players: PlayerModelProps[];
}