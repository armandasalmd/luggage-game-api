import UserModel, { UserDocument, DailyRewardDocument } from "./models/user/UserModel";
import IDailyRewardModel, { DailyRewardState } from "./models/user/IDailyRewardModel";
import IUserModel, { AuthStrategy } from "./models/user/IUserModel";

import LobbyModel, { LobbyDocument, LobbyPlayerDocument } from "./models/lobby/LobbyModel";
import ILobbyPlayerModel from "./models/lobby/ILobbyPlayerModel";
import ILobbyModel from "./models/lobby/ILobbyModel";

import IGameModel from "./models/game/IGameModel";
import IPlayerModel from "./models/game/IPlayerModel";
import GameModel, { GameDocument, PlayerDocument } from "./models/game/GameModel";

export {
  AuthStrategy,
  LobbyModel,
  ILobbyModel,
  ILobbyPlayerModel,
  LobbyDocument,
  LobbyPlayerDocument,
  UserModel,
  IUserModel,
  UserDocument,
  IGameModel,
  IPlayerModel,
  GameModel,
  GameDocument,
  PlayerDocument,
  IDailyRewardModel,
  DailyRewardState,
  DailyRewardDocument
};
