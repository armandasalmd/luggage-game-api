export interface IPayload {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  iat?: number;
  exp?: number;
}
