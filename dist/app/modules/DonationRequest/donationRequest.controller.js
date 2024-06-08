"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationRequestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendresponse_1 = __importDefault(require("../../utils/sendresponse"));
const donationRequest_service_1 = require("./donationRequest.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const donationRequest_constant_1 = require("./donationRequest.constant");
const donationRequestCreateInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fullToken = req.headers.authorization;
    const result = yield donationRequest_service_1.donationRequestServices.donationRequestCreateInDB(req.body, fullToken);
    (0, sendresponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Request create successfully",
        data: result,
    });
}));
const donationRequestWithUserID = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fullToken = req.headers.authorization;
    const result = yield donationRequest_service_1.donationRequestServices.donationRequestWithUserID(req.body, fullToken);
    (0, sendresponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Request create successfully",
        data: result,
    });
}));
const getMyDonation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const result = yield donationRequest_service_1.donationRequestServices.getMyDonation(token);
    (0, sendresponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donation requests retrieved successfully",
        data: result,
    });
}));
const getAllDonationHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const result = yield donationRequest_service_1.donationRequestServices.getAllDonationHistory(token);
    (0, sendresponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Blood Donation retrieved successfully",
        data: result,
    });
}));
const getAllDonationRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const result = yield donationRequest_service_1.donationRequestServices.getAllDonationRequest(token);
    (0, sendresponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Blood Donation request retrieved successfully",
        data: result,
    });
}));
const updateDonation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const reuqestId = req.params.requestId;
    const result = yield donationRequest_service_1.donationRequestServices.updateDonation(req.body, token, reuqestId);
    (0, sendresponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donation request status successfully updated",
        data: result,
    });
}));
const getAllBloodRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, donationRequest_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page"]);
    // console.log({ filters, options });
    const result = yield donationRequest_service_1.donationRequestServices.getAllBloodRequest(filters, options);
    (0, sendresponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Blood request retrived successfully",
        meta: result.meta,
        data: result.data,
    });
}));
exports.donationRequestController = {
    donationRequestCreateInDB,
    donationRequestWithUserID,
    getMyDonation,
    updateDonation,
    getAllBloodRequest,
    getAllDonationHistory,
    getAllDonationRequest,
};
