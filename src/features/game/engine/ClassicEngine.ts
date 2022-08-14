import { BaseEngine } from "./BaseEngine";

export class ClassicEngine extends BaseEngine {
  private readonly powerCards: string[] = ["2", "5", "10"];

  constructor() {
    super("classic");
  }

  public canPlayCards(playDeck: string[], submitQueue: string[], newCards: string[]): boolean {
    if (newCards.length <= 0) return false;
    const newSubmit = [...submitQueue, ...newCards];
    
    if (playDeck.length <= 0 && newSubmit.length <= 2) {
      // If 2 cards, then value must be the same
      return newSubmit.length !== 2 || this.value(newSubmit[0]) === this.value(newSubmit[1]);
    }
    const topCard: string = playDeck[playDeck.length - 1];

    // RULE 1: Can put over
    // At this point, newSubmit has at least 1 card, and placeDeck is not empty
    if (!this.canPutOver(topCard, newSubmit[0])) return false;
    if (newSubmit.length >= 2) {
      for (let i = 1; i < newSubmit.length; i++) {
        if (!this.canPutOver(newSubmit[i - 1], newSubmit[i])) {
          return false;
        }
      }
    }
    
    // RULE 2: Cards most not exceed put count
    // Reset put count after 5 is put, 3-4 same cards in a row are put
    return putCountCorrect.bind(this)(newSubmit);
    
    function putCountCorrect(cards: string[]): boolean {
      if (cards.length <= 1) return true;
      
      // cards.length at least 2 here
      // From here we will remove "continuation blocks" and recursivelly call this function
      // Continuation blocks are 5, three-four in a row
      const first = this.value(cards[0]);

      if (first === "5" || first === "10") {
        return putCountCorrect(cards.slice(1));
      }

      if (cards.length === 2) return false;

      // cards.length at least 3 here
      let count = 1;
      const value = this.value(cards[0]);

      for (let i = 1; i < cards.length; i++) {
        if (this.value(cards[i]) === value) {
          count++;
        } else {
          break;
        }
      }

      if (count === 3 || count === 4) {
        return putCountCorrect.bind(this)(cards.slice(count));
      } else {
        return false;
      }
    }
  }

  protected canPutOver(card1: string, card2: string): boolean {
    if (card1 === undefined) return true;

    const isPowerCard =
      this.powerCards.find((o) => card1.startsWith(o) || card2.startsWith(o)) !== undefined;
    if (isPowerCard) return true;

    return this.indexOf(card1) <= this.indexOf(card2);
  }

  public shouldDestroy(submitQueue: string[], newCards: string[]): boolean {
    if (newCards.findIndex((o) => o.startsWith("10")) !== -1) return true;

    const cards = [...submitQueue, ...newCards];
    if (cards.length < 4) return false;

    let i = 0;
    let value = "";

    for (const card of cards) {
      if (i === 4) break;
      if (this.value(card) === value) {
        i++;
      } else {
        value = this.value(card);
        i = 1;
      }
    }

    return i === 4;
  }
}
