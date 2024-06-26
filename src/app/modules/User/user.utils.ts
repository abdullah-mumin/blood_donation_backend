import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtpayload: { id: string; name: string; email: string; role: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtpayload, secret, {
    expiresIn,
  });
};
