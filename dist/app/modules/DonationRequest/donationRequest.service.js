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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationRequestServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("../User/user.constant");
const donationRequest_constant_1 = require("./donationRequest.constant");
const pagination_1 = require("../../utils/pagination");
const donationRequestCreateInDB = (payload, fullToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = payload;
    if (!fullToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    const [, token] = fullToken.split(" ");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    const isUser = yield prisma_1.default.user.findUnique({
        where: {
            id: payload.donorId,
        },
    });
    if (!isUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not Found", "User not found!");
    }
    userData.requesterId = id;
    const result = yield prisma_1.default.donationRequest.create({
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
    });
    return result;
});
const donationRequestWithUserID = (payload, fullToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = payload;
    if (!fullToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    const [, token] = fullToken.split(" ");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    const isUser = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!isUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not Found", "User not found!");
    }
    userData.requesterId = id;
    const result = yield prisma_1.default.donationRequest.create({
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
    });
    return result;
});
const getMyDonation = (fullToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fullToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    // console.log(token);
    const [, token] = fullToken.split(" ");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    // console.log(id);
    const result = yield prisma_1.default.donationRequest.findMany({
        where: {
            requesterId: id,
        },
        include: {
            donor: true,
            requester: true,
        },
    });
    return result;
});
const updateDonation = (payload, fullToken, requestId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fullToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    const [, token] = fullToken.split(" ");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    const isBloodRequest = yield prisma_1.default.donationRequest.findUnique({
        where: {
            id: requestId,
        },
    });
    if (!isBloodRequest) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not Found", "No donation request found!");
    }
    const isUser = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!isUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not Found", "No user found!");
    }
    // console.log({ isBloodRequest, isUser });
    if ((isBloodRequest === null || isBloodRequest === void 0 ? void 0 : isBloodRequest.requesterId) === (isUser === null || isUser === void 0 ? void 0 : isUser.id)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Forbidden", "You cannot accept your own request!");
    }
    const result = yield prisma_1.default.donationRequest.update({
        where: {
            id: requestId,
        },
        data: {
            donorId: id,
            requestStatus: payload.status,
        },
    });
    return result;
});
const getAllBloodRequest = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = pagination_1.pagination.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // Add the condition for the role if it's part of the DonationRequest model
    // If not, you should remove this condition or adjust accordingly
    andConditions.push({
        requestStatus: {
            equals: "PENDING",
        },
    });
    // Search term conditions
    if (filters.searchTerm) {
        const searchTermConditions = donationRequest_constant_1.userSearchAbleFields
            .map((field) => {
            if (field === "bloodType") {
                if (Object.values(user_constant_1.BloodType).includes(filters.searchTerm)) {
                    return {
                        [field]: {
                            equals: filters.searchTerm,
                            mode: "insensitive",
                        },
                    };
                }
            }
            else {
                return {
                    [field]: {
                        contains: filters.searchTerm,
                        mode: "insensitive",
                    },
                };
            }
            return undefined;
        })
            .filter(Boolean);
        andConditions.push({
            OR: searchTermConditions,
        });
    }
    // Filter conditions
    if (Object.keys(filterData).length > 0) {
        const conditions = Object.entries(filterData)
            .map(([key, value]) => {
            if (key === "bloodType") {
                const bloodTypeValue = value;
                if (Object.values(user_constant_1.BloodType).includes(bloodTypeValue)) {
                    return {
                        [key]: {
                            equals: bloodTypeValue,
                        },
                    };
                }
                else {
                    throw new Error(`Invalid value for bloodType: ${value}`);
                }
            }
            else {
                return {
                    [key]: {
                        equals: value,
                    },
                };
            }
        })
            .filter(Boolean);
        if (conditions.length > 0) {
            andConditions.push({
                AND: conditions,
            });
        }
    }
    const whereConditons = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.donationRequest.findMany({
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
    const total = yield prisma_1.default.donationRequest.count({
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
});
const getAllDonationHistory = (fullToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fullToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    // console.log(token);
    const [, token] = fullToken.split(" ");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    const result = yield prisma_1.default.user.findUnique({
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
    return result === null || result === void 0 ? void 0 : result.requestAsDonor;
});
const getAllDonationRequest = (fullToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fullToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    // console.log(token);
    const [, token] = fullToken.split(" ");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    const allRequests = yield prisma_1.default.donationRequest.findMany({
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
});
exports.donationRequestServices = {
    donationRequestCreateInDB,
    donationRequestWithUserID,
    getMyDonation,
    updateDonation,
    getAllBloodRequest,
    getAllDonationHistory,
    getAllDonationRequest,
};
