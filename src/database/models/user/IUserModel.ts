export default interface IUserModel {
  username: string;
  email?: string;
  password: string;
  coins: number;
  avatar?: string;
}