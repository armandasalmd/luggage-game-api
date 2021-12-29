import { FilterQuery } from "mongoose";

import { IUseCase, Result } from "@core/logic";
import { PublicLobbiesRequest } from "@features/lobby/models/PublicLobbiesRequest";
import { PublicLobbiesResponse } from "@features/lobby/models/PublicLobbiesResponse";
import { LobbyModel, ILobbyModel, LobbyDocument } from "@database";
import { IPublicGame } from "@features/lobby/models/IPublicGame";
import { getPagesCount } from "@utils/Global";
import { GameRulesType } from "@utils/Lobby";

interface IPublicLobbyModel extends Partial<ILobbyModel> {
  numberOfPlayers: number;
}

export default class PublicLobbiesUseCase
  implements IUseCase<PublicLobbiesRequest, PublicLobbiesResponse>
{
  async execute(req: PublicLobbiesRequest): Promise<Result<PublicLobbiesResponse>> {
    const query: FilterQuery<LobbyDocument> = { isPrivate: false, state: "active" };

    if (req.gameMode !== undefined) query.gameRules = req.gameMode as GameRulesType;
    if (req.gamePrice !== undefined) query.gamePrice = req.gamePrice;

    const totalCount = await LobbyModel.count(query);
    const pagesCount = getPagesCount(totalCount, req.pageSize);
    
    if (totalCount < req.pageNumber * req.pageSize) {
      return Result.ok({
        currentPage: req.pageNumber,
        pagesCount,
        games: [],
        totalResults: totalCount
      });
    } 

    let lobbies: IPublicLobbyModel[] = [];

    try {
      lobbies = await LobbyModel.aggregate([
        { $match: query },
        { $skip: req.pageSize * (req.pageNumber - 1) },
        { $limit: req.pageSize },
        { $project: { numberOfPlayers: { $size: "$players" }, gameRules: 1, playerCount: 1, gamePrice: 1, roomCode: 1 } },
      ]);
    } catch {
      return Result.fail("Unexpected error");
    }


    const result: PublicLobbiesResponse = {
      currentPage: req.pageNumber,
      pagesCount,
      totalResults: totalCount,
      games: lobbies.map(this.toPublicGame)
    };

    return Result.ok(result);
  }

  private toPublicGame(lobby: IPublicLobbyModel): IPublicGame {
    return {
      modeTitle: lobby.gameRules,
      players: lobby.numberOfPlayers,
      playersMax: lobby.playerCount,
      price: lobby.gamePrice,
      roomId: lobby.roomCode
    };
  }
}
