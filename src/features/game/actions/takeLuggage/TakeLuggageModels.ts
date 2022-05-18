export interface TakeLuggageQuery {
  luggageCards: string[];
  gameId: string;
  username: string;
}

export interface TakeLuggageRequest {
  luggageCard: string;
}

export interface TakeLuggageResult {
  newLuggage: string;
  seatId: number;
}
