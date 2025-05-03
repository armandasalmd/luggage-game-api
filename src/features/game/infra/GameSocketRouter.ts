import { ISocketEvent, ISocketRouter } from "@core/socket";

import { DisconnectSocketController } from "../actions/disconnect";
import { FinishTurnSocketController } from "../actions/finishTurn";
import { PlayCardsSocketController, PlayCardsRequest } from "../actions/playCards";
import { PlayAgainSocketController } from "../actions/playAgain";
import { SendEmojiSocketController, SendEmojiQuery } from "../actions/sendEmoji";
import { SubscribeSocketController } from "../actions/subscribe";
import { SurrenderSocketController } from "../actions/surrender";
import { TakeLuggageSocketController, TakeLuggageRequest } from "../actions/takeLuggage";

const disconnectGameEvent: ISocketEvent<void> = {
  eventName: "game disconnect",
  controller: () => new DisconnectSocketController(),
};

const finishTurnEvent: ISocketEvent<void> = {
  eventName: "game finish turn",
  controller: () => new FinishTurnSocketController(),
};

const playAgainEvent: ISocketEvent<void> = {
  eventName: "game play again",
  controller: () => new PlayAgainSocketController(),
};

const playCardsEvent: ISocketEvent<PlayCardsRequest> = {
  eventName: "game play cards",
  controller: () => new PlayCardsSocketController(),
};

const sendEmojiEvent: ISocketEvent<SendEmojiQuery> = {
  eventName: "game push emoji",
  controller: () => new SendEmojiSocketController(),
};

const subscribeEvent: ISocketEvent<void> = {
  eventName: "game subscribe",
  controller: () => new SubscribeSocketController(),
};

const surrenderEvent: ISocketEvent<void> = {
  eventName: "game surrender",
  controller: () => new SurrenderSocketController(),
};

const takeLuggageEvent: ISocketEvent<TakeLuggageRequest> = {
  eventName: "game take luggage",
  controller: () => new TakeLuggageSocketController(),
};

const GameSocketRouter: ISocketRouter = {
  events: [
    sendEmojiEvent,
    playAgainEvent,
    playCardsEvent,
    subscribeEvent,
    surrenderEvent,
    finishTurnEvent,
    takeLuggageEvent,
  ],
};

export { GameSocketRouter, disconnectGameEvent };
