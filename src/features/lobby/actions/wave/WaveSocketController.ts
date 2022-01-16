import { SocketController } from "@core/socket";

export default class WaveController extends SocketController<string> {
  protected async executeImpl(roomId: string) {
    this.emitToRoomAll(roomId, "lobby player waved", this.user.username);
  }
}
