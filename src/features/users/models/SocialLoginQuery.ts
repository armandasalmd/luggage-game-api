import { AuthStrategy } from "@database";

export interface SocialLoginQuery {
  email: string;
  firstname: string;
  lastname: string;
  provider: AuthStrategy;
  avatarUrl: string;
}
