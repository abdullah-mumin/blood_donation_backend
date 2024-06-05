import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendresponse";
import httpStatus from "http-status";
import { profileServices } from "./profile.service";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const fullToken = req.headers.authorization as string;
  const result = await profileServices.getMyProfile(fullToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const fullToken = req.headers.authorization as string;
  const result = await profileServices.updateProfile(fullToken, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

export const profileController = {
  getMyProfile,
  updateProfile,
};
