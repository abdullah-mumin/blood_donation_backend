import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import prisma from "../../utils/prisma";
import { Profile } from "@prisma/client";

const getMyProfile = async (token: string) => {
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized Access",
      "You do not have the necessary permissions to access this resource."
    );
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_token as string
  ) as JwtPayload;

  const { id, name, email } = decoded;

  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  });

  return result;
};

const updateProfile = async (token: string, payload: Partial<Profile>) => {
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized Access",
      "You do not have the necessary permissions to access this resource."
    );
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_token as string
  ) as JwtPayload;

  const { id, name, email } = decoded;

  const isUser = await prisma.profile.findUnique({
    where: {
      userId: id,
    },
  });

  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Error", "User not found!");
  }

  const result = await prisma.profile.update({
    where: {
      userId: id,
    },
    data: payload,
  });

  return result;
};

export const profileServices = {
  getMyProfile,
  updateProfile,
};
