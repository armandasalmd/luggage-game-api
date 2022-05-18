enum CardType {
  Clubs = "C",
  Diamonds = "D",
  Hearts = "H",
  Spades = "S",
}

const CardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export class Deck {
  private static readonly SEPARATOR = ",";

  public cards: string[];

  constructor(cards: string[]) {
    this.cards = cards;
  }

  public static createShuffledDeck(): Deck {
    const deck = [];

    for (const type of Object.values(CardType)) {
      for (const value of CardValues) {
        deck.push(value + type);
      }
    }

    return new Deck(Deck.shuffleCards(deck));
  }

  public static toString(cards: string[]): string {
    return cards.join(this.SEPARATOR);
  }

  public static fromString(cards: string): Deck {
    return new Deck(cards.split(this.SEPARATOR));
  }

  private static shuffleCards(cards: string[]) {
    return cards.sort(() => Math.random() - 0.5);
  }

  public get size() {
    return this.cards.length;
  }

  public toString() {
    return Deck.toString(this.cards);
  }

  public put(cards: string[]) {
    cards.forEach(function (card) {
      this.cards.push(card);
    });
  }

  public take(count: number): string[] {
    if (count >= this.cards.length) {
      const result = [...this.cards];
      this.cards = [];

      return result;
    }

    const poppedCards: string[] = [];

    for (let i = 0; i < count; i++) {
      poppedCards.push(this.cards.pop());
    }

    return poppedCards;
  }
}
