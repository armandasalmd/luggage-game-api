import { ISocketEvent, ISocketRouter } from "@core/socket";

import FinishTurnSocketController from "../actions/finishTurn/FinishTurnSocketController";
import PlayCardSocketController from "../actions/playCard/PlayCardSocketController";
import TakeLuggageSocketController from "../actions/takeLuggage/TakeLuggageSocketController";
import SurrenderSocketController from "../actions/surrender/SurrenderSocketController";
import { FinishTurnQuery } from "../models/FinishTurnQuery";
import { PlayCardQuery } from "../models/PlayCardQuery";
import { TakeLuggageQuery } from "../models/TakeLuggageQuery";

const playCardEvent: ISocketEvent<PlayCardQuery> = {
  eventName: "game play card",
  controller: new PlayCardSocketController(),
};

const finishTurnEvent: ISocketEvent<FinishTurnQuery> = {
  eventName: "game finish turn",
  controller: new FinishTurnSocketController(),
};

const surrenderEvent: ISocketEvent<void> = {
  eventName: "game surrender",
  controller: new SurrenderSocketController(),
};

const takeLuggageEvent: ISocketEvent<TakeLuggageQuery> = {
  eventName: "game take luggage",
  controller: new TakeLuggageSocketController(),
};

const GameSocketRouter: ISocketRouter = {
  events: [playCardEvent, finishTurnEvent, surrenderEvent, takeLuggageEvent],
};

export { GameSocketRouter };
