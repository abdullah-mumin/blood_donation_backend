import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendresponse";
import { donationRequestServices } from "./donationRequest.service";
import { Request, Response } from "express";

const donationRequestCreateInDB = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization as string;
    const result = await donationRequestServices.donationRequestCreateInDB(
      req.body,
      token
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Request successfully made",
      data: result,
    });
  }
);

const getMyDonation = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const result = await donationRequestServices.getMyDonation(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation requests retrieved successfully",
    data: result,
  });
});

const updateDonation = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const reuqestId = req.params.requestId;
  const result = await donationRequestServices.updateDonation(
    req.body,
    token,
    reuqestId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation request status successfully updated",
    data: result,
  });
});

export const donationRequestController = {
  donationRequestCreateInDB,
  getMyDonation,
  updateDonation,
};
