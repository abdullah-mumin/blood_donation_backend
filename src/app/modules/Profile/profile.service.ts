import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import prisma from "../../utils/prisma";
import { Profile, User } from "@prisma/client";

const getMyProfile = async (fullToken: string) => {
  if (!fullToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized Access",
      "You do not have the necessary permissions to access this resource."
    );
  }

  const [, token] = fullToken.split(" ");

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
      status: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  });

  return result;
};

const updateProfile = async (fullToken: string, payload: any) => {
  if (!fullToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized Access",
      "You do not have the necessary permissions to access this resource."
    );
  }

  const [, token] = fullToken.split(" ");

  const decoded = jwt.verify(
    token,
    config.jwt_access_token as string
  ) as JwtPayload;

  const { id, name, email } = decoded;

  const isUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Error", "User not found!");
  }

  // console.log(payload);

  const result = await prisma.$transaction(async (transactionClient) => {
    const profileData = {
      bio: payload?.bio,
      age: payload?.age,
      lastDonationDate: payload?.lastDonationDate,
    };

    const userData = {
      name: payload?.name,
      location: payload?.location,
      bloodType: payload?.bloodType,
      availability: payload?.availability,
      status: payload?.status,
    };

    const profileUpdateData = await transactionClient.profile.update({
      where: {
        userId: id,
      },
      data: profileData,
    });

    const userUpdateData = await transactionClient.user.update({
      where: {
        id: id,
      },
      data: userData,
    });

    return { profileUpdateData, userUpdateData };
  });

  return result;
};

export const profileServices = {
  getMyProfile,
  updateProfile,
};
