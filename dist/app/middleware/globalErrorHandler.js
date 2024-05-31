"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { ZodError } from "zod";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
// import handleZodError from "../errors/handleZodError";
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const zod_1 = require("zod");
const globalErrorhandler = (err, req, res, next) => {
    // setting default values
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorDetails;
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.errorSources
            .map((error) => error.message)
            .join(", ");
        errorDetails = { issues: simplifiedError.errorSources };
    }
    else if (err instanceof jsonwebtoken_1.default.TokenExpiredError ||
        err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = `Unauthorized Access`;
        errorDetails = null;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.errorMessage;
        errorDetails = err.statusCode === 401 ? err.message : err.message;
    }
    else if (err instanceof Error) {
        message = err.message;
        errorDetails = "Error!";
    }
    //ultimate return
    return res.status(statusCode).json({
        success: false,
        message: message,
        errorDetails: errorDetails,
        stack: config_1.default.node_env === "development" ? err.stack : null,
    });
};
exports.default = globalErrorhandler;
