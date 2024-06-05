import { Prisma, Profile, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createToken } from "./user.utils";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import {
  BloodType,
  userSearchAbleFields,
  userSortByFields,
} from "./user.constant";
import pick from "../../utils/pick";
import { pagination } from "../../utils/pagination";
import { IUser } from "../../types";

const registrationUser = async (payload: User & Profile) => {
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    isBloodDonate: payload.isBloodDonate,
    bloodType: payload.bloodType,
    location: payload.location,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const userInfo = await transactionClient.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        bloodType: true,
        location: true,
        isBloodDonate: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userProfile = {
      userId: userInfo.id,
    };

    const userProfileInfo = await transactionClient.profile.create({
      data: userProfile,
    });

    const data = {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      bloodType: userInfo.bloodType,
      location: userInfo.location,
      availability: userInfo.availability,
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,
      userProfile: userProfileInfo,
    };

    return data;
  });
  return result;
};

const login = async (payload: { email: string; password: string }) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  // console.log(isUserExist);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!", "Error");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    isUserExist?.password as string
  );

  if (!isCorrectPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is incorrect!",
      "Error"
    );
  }

  const { id, name, email, role } = isUserExist;

  const jwtpayload = {
    id: id,
    name: name,
    email: email,
    role: role,
  };

  const accessToken = createToken(
    jwtpayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtpayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_expires_in as string
  );

  const data = {
    id,
    name,
    email,
    role,
    accessToken,
    refreshToken,
  };

  return data;
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized Access!",
      "You do not have the necessary permissions to access this resource."
    );
  }

  //check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_token as string
  ) as JwtPayload;

  const { id, role, email, name } = decoded;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // console.log(isUserExist);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!", "Error");
  }

  const jwtpayload = {
    id: id,
    name: name,
    email: email,
    role: role,
  };

  //Access Granted: Send Accesstoken, Refreshtoken
  const accessToken = createToken(
    jwtpayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const changePassword = async (user: IUser, payload: any) => {
  // console.log(payload);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.id,
      email: user?.email,
    },
  });
  // console.log(userData);

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Password is not matched! Please enter correct old password.",
      "Password Error!"
    );
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      id: userData?.id,
      email: userData?.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  // return {
  //   message: "Password changed successfully!",
  // };
};

const getAllUser = async (filters: any, options: any) => {
  const { page, limit, skip } = pagination.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions: Prisma.UserWhereInput[] = [];

  andConditions.push({
    role: {
      equals: "USER",
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
      .filter(Boolean) as Prisma.UserWhereInput[];

    andConditions.push({
      OR: searchTermConditions,
    });
  }

  // Filter conditions
  if (Object.keys(filterData).length > 0) {
    const conditions = Object.entries(filterData)
      .map(([key, value]) => {
        if (key === "availability") {
          return {
            [key]: {
              equals: value === "true",
            },
          };
        } else if (key === "bloodType") {
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
      .filter(Boolean) as Prisma.UserWhereInput[];

    if (conditions.length > 0) {
      andConditions.push({
        AND: conditions,
      });
    }
  }

  const whereConditons: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Sorting conditions
  const sortConditions: Prisma.UserOrderByWithRelationInput[] = [];
  if (options.sortBy) {
    if (options.sortBy === "name") {
      sortConditions.push({ [options.sortBy]: options.sortOrder || "asc" });
    } else if (
      options.sortBy === "age" ||
      options.sortBy === "lastDonationDate"
    ) {
      sortConditions.push({
        profile: { [options.sortBy]: options.sortOrder || "asc" },
      });
    }
  } else {
    sortConditions.push({ createdAt: "desc" });
  }

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: sortConditions,
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          id: true,
          userId: true,
          bio: true,
          age: true,
          lastDonationDate: true,
          createdAt: true,
          updatedAt: true,
          user: true,
        },
      },
    },
  });

  const total = await prisma.user.count({
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

const singleBloodDonorByID = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      profile: true,
      requestAsDonor: true,
      requestAsRequester: true,
    },
  });

  return userData;
};

const updateUserStatus = async (
  fullToken: string,
  userId: string,
  payload: any
) => {
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

  const isAdmin = await prisma.user.findUnique({
    where: {
      id: id,
      role: "ADMIN",
    },
  });

  if (!isAdmin) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "Not able to update any information!"
    );
  }

  const isUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Not Found", "No user found!");
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
      // donorId: id,
    },
    data: {
      status: payload.status,
    },
  });

  return result;
};

const updateUserRole = async (
  fullToken: string,
  userId: string,
  payload: any
) => {
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

  const isAdmin = await prisma.user.findUnique({
    where: {
      id: id,
      role: "ADMIN",
    },
  });

  if (!isAdmin) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Not Found",
      "Not able to update any information!"
    );
  }

  const isUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Not Found", "No user found!");
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
      // donorId: id,
    },
    data: {
      role: payload.role,
    },
  });

  return result;
};

const getAllUserForAdmin = async (filters: any, options: any) => {
  const { page, limit, skip } = pagination.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions: Prisma.UserWhereInput[] = [];

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
      .filter(Boolean) as Prisma.UserWhereInput[];

    andConditions.push({
      OR: searchTermConditions,
    });
  }

  // Filter conditions
  if (Object.keys(filterData).length > 0) {
    const conditions = Object.entries(filterData)
      .map(([key, value]) => {
        if (key === "availability") {
          return {
            [key]: {
              equals: value === "true",
            },
          };
        } else if (key === "bloodType") {
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
      .filter(Boolean) as Prisma.UserWhereInput[];

    if (conditions.length > 0) {
      andConditions.push({
        AND: conditions,
      });
    }
  }

  const whereConditons: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Sorting conditions
  const sortConditions: Prisma.UserOrderByWithRelationInput[] = [];
  if (options.sortBy) {
    if (options.sortBy === "name") {
      sortConditions.push({ [options.sortBy]: options.sortOrder || "asc" });
    } else if (
      options.sortBy === "age" ||
      options.sortBy === "lastDonationDate"
    ) {
      sortConditions.push({
        profile: { [options.sortBy]: options.sortOrder || "asc" },
      });
    }
  } else {
    sortConditions.push({ createdAt: "desc" });
  }

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: sortConditions,
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          id: true,
          userId: true,
          bio: true,
          age: true,
          lastDonationDate: true,
          createdAt: true,
          updatedAt: true,
          user: true,
        },
      },
    },
  });

  const total = await prisma.user.count({
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

export const userServices = {
  registrationUser,
  login,
  changePassword,
  getAllUser,
  singleBloodDonorByID,
  updateUserStatus,
  refreshToken,
  updateUserRole,
  getAllUserForAdmin,
};
