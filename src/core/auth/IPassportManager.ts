export interface IPassportManager {
  init(): void;
  serializeUser(user: any, done: any): void;
  deserializeUser(user: any, done: any): void;
}