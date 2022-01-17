import { IUseCase, Result } from "@core/logic";
import { UserModel, IUserModel, paginatedFind, FriendState } from "@database";
import { IFriendUser } from "@features/friends/models/IFriendUser";
import { SearchRequest } from "@features/friends/models/SearchRequest";
import { SearchResponse } from "@features/friends/models/SearchResponse";
import { escapeRegExp, getPagesCount } from "@utils/Global";
import { GetFriendsUseCase } from "../getFriends/GetFriendsUseCase";

export class SearchUseCase implements IUseCase<SearchRequest, SearchResponse> {
  async execute(request: SearchRequest): Promise<Result<SearchResponse>> {
    const regex = new RegExp(escapeRegExp(request.searchTerm), "i");
    const clientUsernameRegex = new RegExp("^" + escapeRegExp(request.clientUsername) + "$");

    const query = { $and: [{ username: regex }, { username: { $not: clientUsernameRegex } }] };
    const totalCount = await UserModel.count(query);
    const pagesCount = getPagesCount(totalCount, request.pageSize);

    // Find users for given input
    let users: IUserModel[] = await paginatedFind(UserModel, request, query, {
      username: 1,
      avatar: 1,
    });

    if (!users) users = [];

    // Get requesting user friend states
    const friendsIncPending = await this.getFriendsIncPending(request.clientUsername);
    const result: IFriendUser[] = users.map((item) => this.toFriendUser(item, friendsIncPending));

    return Result.ok({
      currentPage: request.pageNumber,
      pagesCount,
      totalResults: totalCount,
      users: result,
    });
  }

  private toFriendUser(user: IUserModel, friendsIncPending: IFriendUser[]): IFriendUser {
    const existing: IFriendUser = friendsIncPending.find((item) => item.username === user.username);

    return {
      username: user.username,
      avatar: user.avatar,
      state: existing ? existing.state : FriendState.None,
    };
  }

  private async getFriendsIncPending(forUsername: string): Promise<IFriendUser[]> {
    const useCase = new GetFriendsUseCase();
    const result = await useCase.execute({
      forUsername,
      includeAvatar: false,
      includePending: true,
    });

    return result.isSuccess ? result.value.friends : [];
  }
}
