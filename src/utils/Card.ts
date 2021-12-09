enum CardType {
  Clubs = "C",
  Diamonds = "D",
  Hearts = "H",
  Spades = "S",
}

const CardTypes = [
  CardType.Clubs,
  CardType.Diamonds,
  CardType.Hearts,
  CardType.Spades,
];

const CardValues = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

export const isValid = (card: string): boolean => {
  const value = card.length === 3 ? card.substr(0, 2) : card.substr(0, 1);
  const kind = card.length === 3 ? card.substr(2, 1) : card.substr(1, 1);

  return CardValues.includes(value) && CardTypes.includes(kind as CardType);
}

export default { CardType, CardTypes, CardValues, isValid };
