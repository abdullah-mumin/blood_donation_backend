import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { Prisma } from "@prisma/client";
import { BloodType } from "../User/user.constant";
import { userSearchAbleFields } from "./donationRequest.constant";
import { pagination } from "../../utils/pagination";

const donationRequestCreateInDB = async (payload: any, fullToken: string) => {
  const userData = payload;
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

const donationRequestWithUserID = async (payload: any, fullToken: string) => {
  const userData = payload;
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
    throw new AppError(httpStatus.NOT_FOUND, "Not Found", "User not found!");
  }

  userData.requesterId = id;
  const result = await prisma.donationRequest.create({
    data: userData,
    select: {
      id: true,
      phoneNumber: true,
      dateOfDonation: true,
      reason: true,
      numberOfBag: true,
      bloodType: true,
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
          profile: true,
        },
      },
    },
  } as Prisma.DonationRequestCreateArgs);

  return result;
};

const getMyDonation = async (fullToken: string) => {
  if (!fullToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized Access",
      "You do not have the necessary permissions to access this resource."
    );
  }
  // console.log(token);
  const [, token] = fullToken.split(" ");

  const decoded = jwt.verify(
    token,
    config.jwt_access_token as string
  ) as JwtPayload;

  const { id, name, email } = decoded;
  // console.log(id);

  const result = await prisma.donationRequest.findMany({
    where: {
      requesterId: id,
    },
    include: {
      donor: true,
      requester: true,
    },
  });

  return result;
};

const updateDonation = async (
  payload: any,
  fullToken: string,
  requestId: string
) => {
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

  const isBloodRequest = await prisma.donationRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!isBloodRequest) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "No donation request found!"
    );
  }

  const isUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Not Found", "No user found!");
  }

  // console.log({ isBloodRequest, isUser });

  if (isBloodRequest?.requesterId === isUser?.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Forbidden",
      "You cannot accept your own request!"
    );
  }

  const result = await prisma.donationRequest.update({
    where: {
      id: requestId,
    },
    data: {
      donorId: id,
      requestStatus: payload.status,
    },
  });

  return result;
};

const getAllBloodRequest = async (filters: any, options: any) => {
  const { page, limit, skip } = pagination.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions: Prisma.DonationRequestWhereInput[] = [];

  // Add the condition for the role if it's part of the DonationRequest model
  // If not, you should remove this condition or adjust accordingly
  andConditions.push({
    requestStatus: {
      equals: "PENDING",
    },
  });

  // Search term conditions
  if (filters.searchTerm) {
    const searchTermConditions = userSearchAbleFields
      .map((field) => {
        if (field === "bloodType") {
          if (Object.values(BloodType).includes(filters.searchTerm)) {
            return {
              [field]: {
                equals: filters.searchTerm as BloodType,
                mode: "insensitive",
              },
            };
          }
        } else {
          return {
            [field]: {
              contains: filters.searchTerm,
              mode: "insensitive",
            },
          };
        }
        return undefined;
      })
      .filter(Boolean) as Prisma.DonationRequestWhereInput[];

    andConditions.push({
      OR: searchTermConditions,
    });
  }

  // Filter conditions
  if (Object.keys(filterData).length > 0) {
    const conditions = Object.entries(filterData)
      .map(([key, value]) => {
        if (key === "bloodType") {
          const bloodTypeValue = value as BloodType;
          if (Object.values(BloodType).includes(bloodTypeValue)) {
            return {
              [key]: {
                equals: bloodTypeValue,
              },
            };
          } else {
            throw new Error(`Invalid value for bloodType: ${value}`);
          }
        } else {
          return {
            [key]: {
              equals: value,
            },
          };
        }
      })
      .filter(Boolean) as Prisma.DonationRequestWhereInput[];

    if (conditions.length > 0) {
      andConditions.push({
        AND: conditions,
      });
    }
  }

  const whereConditons: Prisma.DonationRequestWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.donationRequest.findMany({
    where: whereConditons,
    skip,
    take: limit,
    include: {
      requester: {
        include: {
          profile: true,
        },
      },
    },
  });

  const total = await prisma.donationRequest.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllDonationHistory = async (fullToken: string) => {
  if (!fullToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized Access",
      "You do not have the necessary permissions to access this resource."
    );
  }
  // console.log(token);
  const [, token] = fullToken.split(" ");

  const decoded = jwt.verify(
    token,
    config.jwt_access_token as string
  ) as JwtPayload;

  const { id, name, email } = decoded;

  const result = await prisma.user.findUnique({
    where: { id: id },
    include: {
      requestAsDonor: {
        where: { requestStatus: "APPROVED" },
        include: {
          requester: true,
        },
      },
    },
  });

  return result?.requestAsDonor;
};

const getAllDonationRequest = async (fullToken: string) => {
  if (!fullToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized Access",
      "You do not have the necessary permissions to access this resource."
    );
  }
  // console.log(token);
  const [, token] = fullToken.split(" ");

  const decoded = jwt.verify(
    token,
    config.jwt_access_token as string
  ) as JwtPayload;

  const { id, name, email } = decoded;

  const allRequests = await prisma.donationRequest.findMany({
    where: {
      requestStatus: { not: "APPROVED" },
      requesterId: { not: id },
    },
    include: {
      requester: true,
    },
  });

  // const result = allRequests.filter((request) => request.requesterId !== id);

  return allRequests;
};

export const donationRequestServices = {
  donationRequestCreateInDB,
  donationRequestWithUserID,
  getMyDonation,
  updateDonation,
  getAllBloodRequest,
  getAllDonationHistory,
  getAllDonationRequest,
};
