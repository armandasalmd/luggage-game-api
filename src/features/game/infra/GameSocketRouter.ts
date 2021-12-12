import { ISocketEvent, ISocketRouter } from "@core/socket";
import FinishTurnSocketController from "../actions/finishTurn/FinishTurnSocketController";
import PlayCardSocketController from "../actions/playCard/PlayCardSocketController";
import { FinishTurnQuery } from "../models/FinishTurnQuery";
import { PlayCardQuery } from "../models/PlayCardQuery";

const playCardEvent: ISocketEvent<PlayCardQuery> = {
  eventName: "game play card",
  controller: new PlayCardSocketController(),
};

const finishTurnEvent: ISocketEvent<FinishTurnQuery> = {
  eventName: "game finish turn",
  controller: new FinishTurnSocketController(),
};

const GameSocketRouter: ISocketRouter = {
  events: [playCardEvent, finishTurnEvent],
};

export { GameSocketRouter };
