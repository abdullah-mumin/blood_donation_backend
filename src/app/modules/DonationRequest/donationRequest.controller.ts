import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendresponse";
import { donationRequestServices } from "./donationRequest.service";
import { Request, Response } from "express";
import pick from "../../utils/pick";
import { userFilterableFields } from "./donationRequest.constant";

const donationRequestCreateInDB = catchAsync(
  async (req: Request, res: Response) => {
    const fullToken = req.headers.authorization as string;
    const result = await donationRequestServices.donationRequestCreateInDB(
      req.body,
      fullToken
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Request create successfully",
      data: result,
    });
  }
);

const donationRequestWithUserID = catchAsync(
  async (req: Request, res: Response) => {
    const fullToken = req.headers.authorization as string;
    const result = await donationRequestServices.donationRequestWithUserID(
      req.body,
      fullToken
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Request create successfully",
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

const getAllDonationHistory = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization as string;
    const result = await donationRequestServices.getAllDonationHistory(token);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Blood Donation retrieved successfully",
      data: result,
    });
  }
);

const getAllDonationRequest = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization as string;
    const result = await donationRequestServices.getAllDonationRequest(token);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Blood Donation request retrieved successfully",
      data: result,
    });
  }
);

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

const getAllBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page"]);
  // console.log({ filters, options });
  const result = await donationRequestServices.getAllBloodRequest(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Blood request retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const donationRequestController = {
  donationRequestCreateInDB,
  donationRequestWithUserID,
  getMyDonation,
  updateDonation,
  getAllBloodRequest,
  getAllDonationHistory,
  getAllDonationRequest,
};
