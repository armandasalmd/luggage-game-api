import { SocketController } from "@core/socket";
import { ISuccessResult } from "@core/interfaces";
import { SendEmojiQuery } from "./SendEmojiModels";

export class SendEmojiSocketController extends SocketController<SendEmojiQuery> {
  protected async executeImpl(input: SendEmojiQuery): Promise<ISuccessResult> {
    const { gameId, username } = this.user;

    if (!input.emojiId) {
      return {
        success: false,
        message: "EmojiId must be included",
      };
    } else if (!gameId || !username) {
      return {
        success: false,
        message: "GameId or username missing",
      };
    }

    this.emitToRoom(gameId, "game emoji", {
      sender: username,
      emojiId: input.emojiId,
    });

    return {
      success: true,
    };
  }
}
