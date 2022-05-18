import { GameRulesType } from "@utils/Lobby";
import { BaseEngine } from "./BaseEngine";
import { ClassicEngine } from "./ClassicEngine";

export function getEngine(rules: GameRulesType | string): BaseEngine {
  switch (rules) {
    case "classic":
    default:
      return new ClassicEngine();
  }
}