import { Entity, Schema } from "redis-om";
import { PlayerModel } from "./PlayerModel";
import { getPlayerRepository } from "../RedisManager";
import { GameRulesType } from "@utils/Lobby";

export interface GameModelProps {
  activeSeatId: number;
  deadCardsCount: number;
  gamePrice: number;
  gameRules: GameRulesType;
  lobbyId: string;
  playDeck: string[];
  players: string[];
  seatsDone: string;
  sourceDeck: string[];
}

// tslint:disable-next-line
export interface GameModel extends GameModelProps {}

export class GameModel extends Entity {
  async getAllPlayers(): Promise<PlayerModel[]> {
    return getPlayerRepository().search().where("gameId").equals(this.entityId).all();
  }

  async getPlayerBySeatId(seatId: number): Promise<PlayerModel> {
    return getPlayerRepository()
      .search()
      .where("gameId")
      .equals(this.entityId)
      .and("seatId")
      .equals(seatId)
      .first();
  }

  async getActivePlayer(): Promise<PlayerModel> {
    return this.getPlayerBySeatId(this.activeSeatId);
  }

  get playersDone(): number[] {
    // tslint:disable-next-line
    return !this.seatsDone ? [] : this.seatsDone.split(",").map((o) => parseInt(o));
  }
}

export const gameSchema = new Schema(
  GameModel,
  {
    activeSeatId: { type: "number" },
    deadCardsCount: { type: "number" },
    gamePrice: { type: "number" },
    gameRules: { type: "string" },
    lobbyId: { type: "string" },
    playDeck: { type: "string[]" },
    players: { type: "string[]" },
    seatsDone: { type: "string" },
    sourceDeck: { type: "string[]" },
  },
  {
    prefix: "game",
  }
);
