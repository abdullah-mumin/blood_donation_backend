/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from "express";
// import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import config from "../config";
// import handleZodError from "../errors/handleZodError";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import handleZodError from "../errors/handleZodError";
import { ZodError } from "zod";
import { TErrorSources } from "../interface/error";

const globalErrorhandler: ErrorRequestHandler = (err, req, res, next) => {
  // setting default values
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails;

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.errorSources
      .map((error) => error.message)
      .join(", ");
    errorDetails = { issues: simplifiedError.errorSources };
  } else if (
    err instanceof jwt.TokenExpiredError ||
    err instanceof jwt.JsonWebTokenError
  ) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = `Unauthorized Access`;
    errorDetails = null;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.errorMessage;
    errorDetails = err.statusCode === 401 ? err.message : err.message;
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = "Error!";
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message: message,
    errorDetails: errorDetails,
    stack: config.node_env === "development" ? err.stack : null,
  });
};

export default globalErrorhandler;
