import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  role: string;
}

export const signAccessToken = (userId: string, role: string): string =>
  jwt.sign({ sub: userId, role }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  } as jwt.SignOptions);

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
