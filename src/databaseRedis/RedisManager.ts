import { Client, Repository } from "redis-om";
import { RedisConfig } from "@core/config";
import { GameModel, gameSchema } from "./models/GameModel";
import { PlayerModel, playerSchema } from "./models/PlayerModel";

export default class RedisManager {
  public static instance: RedisManager;

  private constructor(public client: Client) {}

  public static connect() {
    if (RedisManager.instance === undefined) {
      const client = new Client();
      const uri = new RedisConfig().uri;

      client
        .open(uri)
        .then((c) => {
          RedisManager.instance = new RedisManager(c);
          console.log(!!c ? "Redis connected" : "Redis connection failed");

          this.tryBuildIndexes();
        })
        .catch(() => {
          console.log("Redis connection error. Retrying in 5 seconds...");
          setTimeout(() => RedisManager.connect(), 5000);
        });
    }
  }

  public static tryBuildIndexes() {
    console.log("...Building Redis indexes");
    _tryBuild(this.gameRepository);
    _tryBuild(this.playerRepository);

    function _tryBuild(repository: Repository<any>) {
      try {
        repository.dropIndex();
        repository.createIndex();
      } catch {
        console.log("Index building failed");
      }
    }
  }

  public static get gameRepository(): Repository<GameModel> | null {
    if (RedisManager.instance.client) {
      return RedisManager.instance.client.fetchRepository(gameSchema);
    } else return null;
  }

  public static get playerRepository(): Repository<PlayerModel> | null {
    if (RedisManager.instance.client) {
      return RedisManager.instance.client.fetchRepository(playerSchema);
    } else return null;
  }
}

export function getGameRepository() {
  return RedisManager.gameRepository;
}

export function getPlayerRepository() {
  return RedisManager.playerRepository;
}

export function getRepositories() {
  return {
    gameRepository: getGameRepository(),
    playerRepository: getPlayerRepository(),
  };
}
