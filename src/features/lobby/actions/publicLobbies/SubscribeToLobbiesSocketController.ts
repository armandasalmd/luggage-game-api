import { SocketController } from "@core/socket";
import { PublicLobbiesRoom } from "@core/socket/EmitEventType";
import PublicLobbiesManager from "./PublicLobbiesManager";

export default class SubscribeToLobbiesController extends SocketController<boolean> {
  protected async executeImpl(makeSubscribed: boolean) {
    /**
     * NOTE: useEffect function in react app should subscribe
     * on PublicLobbies component mount and unsubscribe on
     * same useEffect cleanup function
     */

    if (makeSubscribed === true) {
      this.joinRoom(PublicLobbiesRoom);
      return PublicLobbiesManager.getAvailableLobbies() || [];
    } else {
      this.leaveRoom(PublicLobbiesRoom);
    }

    return null;
  }
}
