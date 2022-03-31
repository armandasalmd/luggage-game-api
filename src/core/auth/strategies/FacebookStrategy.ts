import { Profile, Strategy } from "passport-facebook";

import SocialLoginUseCase from "@features/users/actions/socialLogin/SocialLoginUseCase";
import { SocialLoginQuery } from "@features/users/models/SocialLoginQuery";
import { AuthStrategy } from "@database";

export interface IFacebookStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  profileFields?: string[];
}

function FacebookStrategy(options: IFacebookStrategyOptions) {
  return new Strategy(
    options,
    async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
      if (profile.emails.length === 0 || typeof profile.emails[0].value !== "string") {
        done("Cannot retrieve your email from provider", false);
      }

      const avatarUrl = `http://graph.facebook.com/${profile.id}/picture?type=large&width=216&height=216`;
      const useCase = new SocialLoginUseCase();
      const query: SocialLoginQuery = {
        avatarUrl,
        email: profile.emails[0].value,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        provider: AuthStrategy.Facebook,
      };

      const result = await useCase.execute(query);

      if (result.isFailure) {
        done(null, false, { message: result.error.message });
      } else {
        done(null, result.value.userPayload);
      }
    }
  );
}

export default FacebookStrategy;
