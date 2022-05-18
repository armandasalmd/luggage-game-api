import { GameRulesType } from "@utils/Lobby";

export abstract class BaseEngine
{
  private static readonly availableCards: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  constructor(public gameRules: GameRulesType) {}

  public abstract canPlayCards(playDeck: string[], submitQueue: string[], newCards: string[]): boolean;

  protected abstract canPutOver(card1: string, card2: string): boolean;

  public abstract shouldDestroy(submitQueue: string[], newCards: string[]): boolean;

  protected static valueStatic(card: string): string {
    if (!card) return "";
    if (card.length === 2) return card.substring(0, 1);
    if (card.length === 3) return card.substring(0, 2);
    return "";
  }

  protected value(card: string): string {
    return BaseEngine.valueStatic(card);
  }

  protected indexOf(card: string): number {
    return BaseEngine.availableCards.indexOf(this.value(card));
  }

  public static isValid(card: string): boolean {
    return BaseEngine.availableCards.includes(BaseEngine.valueStatic(card));
  }
}
