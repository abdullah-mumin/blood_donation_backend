import { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import prisma from "../utils/prisma";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { IUser } from "../types";

const auth = (...requiredRoles: string[]) => {
  return catchAsync(
    async (
      req: Request & { user?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      //authorization check
      const fullToken = req.headers.authorization as string;

      //check if the token is sent from client
      if (!fullToken) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Unauthorized Access",
          "You do not have the necessary permissions to access this resource."
        );
      }
      // console.log(token);
      const [, token] = fullToken.split(" ");
      // console.log(token);

      //check if the token is valid

      const decoded = jwt.verify(
        token,
        config.jwt_access_token as string
      ) as JwtPayload;

      // console.log(decoded);

      const { id, name, role, email } = decoded;
      //   console.log(id, name, email);

      const userInfo = await prisma.user.findUnique({
        where: {
          id: id,
          email: email,
        },
      });
      if (!userInfo) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "Not Found",
          "User is not found!"
        );
      }

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Unauthorized Access",
          "You do not have the necessary permissions to access this resource."
        );
      }

      req.user = decoded as IUser;
      next();
    }
  );
};

export default auth;
