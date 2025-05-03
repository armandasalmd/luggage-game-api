import { Entity, Schema } from "redis-om";

export interface PlayerModelProps {
  gameId: string; // ref: Redis OM generated ID for GameModel
  handCards: string[];
  luggageCards: string;
  seatId: number;
  submitQueue: string[];
  status: string;
  username: string;
  connected: boolean;
}

// tslint:disable-next-line
export interface PlayerModel extends PlayerModelProps {}

export class PlayerModel extends Entity {}

export const playerSchema = new Schema(PlayerModel, {
  gameId: { type: "string" },
  handCards: { type: "string[]" },
  luggageCards: { type: "string" },
  seatId: { type: "number" },
  submitQueue: { type: "string[]" },
  status: { type: "string" },
  username: { type: "string" },
  connected: { type: "boolean" },
}, {
  prefix: "player"
});
