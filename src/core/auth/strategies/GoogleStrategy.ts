import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

import SocialLoginUseCase from "@features/users/actions/socialLogin/SocialLoginUseCase";
import { SocialLoginQuery } from "@features/users/models/SocialLoginQuery";
import { AuthStrategy } from "@database";

export interface IGoogleStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

function GoogleStrategy(options: IGoogleStrategyOptions) {
  return new Strategy(
    options,
    async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
      if (profile.emails.length === 0 || typeof profile.emails[0].value !== "string") {
        done("Cannot retrieve your email from provider", false);
      }

      const useCase = new SocialLoginUseCase();
      const query: SocialLoginQuery = {
        avatarUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "",
        email: profile.emails[0].value,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        provider: AuthStrategy.Google,
      };

      const result = await useCase.execute(query);

      if (result.isFailure) {
        // redirects user to failure url
        done(null, false, { message: result.error.message });
      } else {
        // serialises data to JWT first, then redirects user to success
        done(null, result.value.userPayload);
      }
    }
  );
}

export default GoogleStrategy;
