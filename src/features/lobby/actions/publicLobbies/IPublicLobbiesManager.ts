import { IPublicGame } from "@features/lobby/models/IPublicGame";

export interface IPublicLobbiesManager {
  add(details: IPublicGame): boolean;
  remove(roomId: string): boolean;
  update(details: IPublicGame): boolean;
}