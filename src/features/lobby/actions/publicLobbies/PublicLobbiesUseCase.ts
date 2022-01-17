import { FilterQuery } from "mongoose";

import { IUseCase, Result } from "@core/logic";
import { PublicLobbiesRequest } from "@features/lobby/models/PublicLobbiesRequest";
import { PublicLobbiesResponse } from "@features/lobby/models/PublicLobbiesResponse";
import { LobbyModel, ILobbyModel, LobbyDocument, paginatedFind } from "@database";
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
    const query: FilterQuery<LobbyDocument> = { isPrivate: false };

    if (req.gameMode !== undefined) query.gameRules = req.gameMode as GameRulesType;
    if (req.gamePrice !== undefined) query.gamePrice = req.gamePrice;

    const totalCount = await LobbyModel.count(query);
    const pagesCount = getPagesCount(totalCount, req.pageSize);

    if (totalCount < (req.pageNumber - 1) * req.pageSize) {
      return Result.ok({
        currentPage: req.pageNumber,
        pagesCount,
        games: [],
        totalResults: totalCount,
      });
    }

    let lobbies: IPublicLobbyModel[] = [];

    try {
      const projection = {
        numberOfPlayers: { $size: "$players" },
        gameRules: 1,
        playerCount: 1,
        gamePrice: 1,
        roomCode: 1,
      };
      lobbies = await paginatedFind(LobbyModel, req, query, projection);
    } catch {
      return Result.fail("Unexpected error");
    }

    const result: PublicLobbiesResponse = {
      currentPage: req.pageNumber,
      pagesCount,
      totalResults: totalCount,
      games: lobbies.map(this.toPublicGame),
    };

    return Result.ok(result);
  }

  private toPublicGame(lobby: IPublicLobbyModel): IPublicGame {
    return {
      modeTitle: lobby.gameRules,
      players: lobby.numberOfPlayers,
      playersMax: lobby.playerCount,
      price: lobby.gamePrice,
      roomId: lobby.roomCode,
    };
  }
}
