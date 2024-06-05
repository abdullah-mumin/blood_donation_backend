import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendresponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { userFilterableFields } from "./user.constant";
import { IUser } from "../../types";
import config from "../../config";

const registrationUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.registrationUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.login(req.body);

  const { refreshToken, accessToken, id, name, email, role } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in succesfully",
    data: {
      id,
      name,
      email,
      role,
      accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await userServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved succesfully!",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user as IUser;

    const result = await userServices.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed successfully",
      data: result,
    });
  }
);

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userServices.getAllUser(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donors retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});

const singleBloodDonorByID = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.singleBloodDonorByID(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donor information retrived successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const { id } = req.params;
  const result = await userServices.updateUserStatus(token, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const { id } = req.params;
  const result = await userServices.updateUserRole(token, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

const getAllUserForAdmin = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userServices.getAllUserForAdmin(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donors retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const userController = {
  registrationUser,
  loginUser,
  changePassword,
  getAllUser,
  singleBloodDonorByID,
  updateUserStatus,
  refreshToken,
  updateUserRole,
  getAllUserForAdmin,
};
