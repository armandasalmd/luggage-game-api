import { Server } from "socket.io";
import { FilterQuery } from "mongoose";

import { IPublicGame } from "@features/lobby/models/IPublicGame";
import { IPublicLobbiesManager } from "./IPublicLobbiesManager";
import { LobbyModel, ILobbyModel, LobbyDocument } from "@database";
import { PublicLobbiesRoom, EmitEventType } from "@core/socket/EmitEventType";
import { toPublicGame2 } from "@utils/Lobby";

export interface IPublicLobbyModel extends Partial<ILobbyModel> {
  numberOfPlayers: number;
}

export default class PublicLobbiesManager implements IPublicLobbiesManager {
  private readonly EMIT_DELAY = 2000;
  private timeout: NodeJS.Timeout = null;
  private static instance: PublicLobbiesManager;
  private static publicGames: IPublicGame[] = [];

  private constructor(private io: Server) {
    this.initPublicGamesAsync();
  }

  private async initPublicGamesAsync(): Promise<void> {
    let lobbies: IPublicLobbyModel[] = [];

    try {
      const query: FilterQuery<LobbyDocument> = { isPrivate: false, state: "active" };

      lobbies = await LobbyModel.aggregate([
        { $match: query },
        {
          $project: {
            numberOfPlayers: { $size: "$players" },
            gameRules: 1,
            playerCount: 1,
            gamePrice: 1,
            roomCode: 1,
          },
        },
      ]);

      if (lobbies && lobbies.length > 0) {
        PublicLobbiesManager.publicGames.push(...lobbies.map(toPublicGame2));
      }
    } catch {
      console.warn("Cannot instanciate, load public lobbies");
    }
  }

  public static getInstance(ioServer?: Server) {
    if (this.instance === undefined) {
      if (ioServer === undefined) {
        console.error(
          "Public lobbies manager cannot instanciate because ioServer was not passed in"
        );
      } else {
        this.instance = new PublicLobbiesManager(ioServer);
      }
    }

    return this.instance;
  }

  public add(details: IPublicGame): boolean {
    if (!details) return false;

    const existingIdx = PublicLobbiesManager.publicGames.findIndex(
      (item) => item.roomId === details.roomId
    );

    if (existingIdx > -1) return false;

    PublicLobbiesManager.publicGames.push(details);
    this.scheduleStateEmit();
    return true;
  }

  public remove(roomId: string): boolean {
    const itemIdx = PublicLobbiesManager.publicGames.findIndex((item) => item.roomId === roomId);

    if (itemIdx < 0) return false;

    PublicLobbiesManager.publicGames.splice(itemIdx, 1);
    this.scheduleStateEmit();
    return true;
  }

  public update(details: IPublicGame): boolean {
    const existingIdx = PublicLobbiesManager.publicGames.findIndex(
      (item) => item.roomId === details.roomId
    );

    if (existingIdx < 0) return false;

    PublicLobbiesManager.publicGames[existingIdx] = details;
    this.scheduleStateEmit();
    return true;
  }

  public static getAvailableLobbies(): IPublicGame[] {
    return PublicLobbiesManager.publicGames.filter((item) => item.playersMax !== item.players);
  }

  private scheduleStateEmit(): void {
    if (this.timeout === null) {
      this.timeout = setTimeout(() => {
        this.emitToAll();
        this.timeout = null;
      }, this.EMIT_DELAY);
    }
  }

  private emitToAll(): void {
    /**
     * In initial manager version we send all public lobbies once some change is made
     * Later we expect to implement more efficient algorithm that sends only modified
     * public games over the wire. This is important when the application user count grows.
     */
    const eventType: EmitEventType = "lobbies changed";
    this.io.to(PublicLobbiesRoom).emit(eventType, PublicLobbiesManager.getAvailableLobbies());
  }
}
