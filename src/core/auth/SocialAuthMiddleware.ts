import { Request, Response } from "express";
import ISerializedUser from "./ISerializedUser";
import { PassportConfig } from "@core/config";

const passportConfig = new PassportConfig();

export default (req: Request, res: Response) => {
  const serializedUser: ISerializedUser = (req as any).session.passport.user;

  if (serializedUser) {
    res.redirect(passportConfig.getSuccessUrl(serializedUser.token));
  } else {
    res.redirect(passportConfig.getFailureUrl("Failed to authenticate"));
  }
}