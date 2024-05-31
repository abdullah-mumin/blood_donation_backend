import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { Prisma, RequestStatus } from "@prisma/client";

const donationRequestCreateInDB = async (payload: any, token: string) => {
  const userData = payload;
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

  const isUser = await prisma.user.findUnique({
    where: {
      id: payload.donorId,
    },
  });

  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Not Found", "User not found!");
  }

  userData.requesterId = id;
  const result = await prisma.donationRequest.create({
    data: userData,
    select: {
      id: true,
      donorId: true,
      phoneNumber: true,
      dateOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      donor: {
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
      },
    },
  } as Prisma.DonationRequestCreateArgs);

  return result;
};

const getMyDonation = async (token: string) => {
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
  console.log(id);

  const result = await prisma.donationRequest.findMany({
    where: {
      requesterId: id,
    },
    select: {
      id: true,
      donorId: true,
      requesterId: true,
      phoneNumber: true,
      dateOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          bloodType: true,
          location: true,
          availability: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    } as Prisma.DonationRequestSelect,
  });

  return result;
};

const updateDonation = async (
  payload: any,
  token: string,
  requestId: string
) => {
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

  const isUser = await prisma.donationRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!isUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "No donation request found!"
    );
  }

  const result = await prisma.donationRequest.update({
    where: {
      id: requestId,
      // donorId: id,
    },
    data: {
      requestStatus: payload.status,
    },
  });

  return result;
};
export const donationRequestServices = {
  donationRequestCreateInDB,
  getMyDonation,
  updateDonation,
};
