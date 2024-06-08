"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userServices = void 0;
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_utils_1 = require("./user.utils");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_constant_1 = require("./user.constant");
const pagination_1 = require("../../utils/pagination");
const registrationUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt.hash(payload.password, 12);
    const userData = {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        isBloodDonate: payload.isBloodDonate,
        bloodType: payload.bloodType,
        location: payload.location,
    };
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const userInfo = yield transactionClient.user.create({
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
        const userProfileInfo = yield transactionClient.profile.create({
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
    }));
    return result;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    // console.log(isUserExist);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!", "Error");
    }
    const isCorrectPassword = yield bcrypt.compare(payload.password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect!", "Error");
    }
    const { id, name, email, role } = isUserExist;
    const jwtpayload = {
        id: id,
        name: name,
        email: email,
        role: role,
    };
    const accessToken = (0, user_utils_1.createToken)(jwtpayload, config_1.default.jwt_access_token, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, user_utils_1.createToken)(jwtpayload, config_1.default.jwt_refresh_token, config_1.default.jwt_refresh_expires_in);
    const data = {
        id,
        name,
        email,
        role,
        accessToken,
        refreshToken,
    };
    return data;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access!", "You do not have the necessary permissions to access this resource.");
    }
    //check if the token is valid
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_token);
    const { id, role, email, name } = decoded;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    // console.log(isUserExist);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!", "Error");
    }
    const jwtpayload = {
        id: id,
        name: name,
        email: email,
        role: role,
    };
    //Access Granted: Send Accesstoken, Refreshtoken
    const accessToken = (0, user_utils_1.createToken)(jwtpayload, config_1.default.jwt_access_token, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(payload);
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    // console.log(userData);
    const isCorrectPassword = yield bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Password is not matched! Please enter correct old password.", "Password Error!");
    }
    const hashedPassword = yield bcrypt.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            id: userData === null || userData === void 0 ? void 0 : userData.id,
            email: userData === null || userData === void 0 ? void 0 : userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    // return {
    //   message: "Password changed successfully!",
    // };
});
const getAllUser = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = pagination_1.pagination.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    andConditions.push({
        role: {
            equals: "USER",
        },
    });
    // Search term conditions
    if (filters.searchTerm) {
        const searchTermConditions = user_constant_1.userSearchAbleFields
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
            if (key === "availability") {
                return {
                    [key]: {
                        equals: value === "true",
                    },
                };
            }
            else if (key === "bloodType") {
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
    // Sorting conditions
    const sortConditions = [];
    if (options.sortBy) {
        if (options.sortBy === "name") {
            sortConditions.push({ [options.sortBy]: options.sortOrder || "asc" });
        }
        else if (options.sortBy === "age" ||
            options.sortBy === "lastDonationDate") {
            sortConditions.push({
                profile: { [options.sortBy]: options.sortOrder || "asc" },
            });
        }
    }
    else {
        sortConditions.push({ createdAt: "desc" });
    }
    const result = yield prisma_1.default.user.findMany({
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
    const total = yield prisma_1.default.user.count({
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
const singleBloodDonorByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
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
});
const updateUserStatus = (fullToken, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fullToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    // console.log(token);
    const [, token] = fullToken.split(" ");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    const isAdmin = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
            role: "ADMIN",
        },
    });
    if (!isAdmin) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not Found", "Not able to update any information!");
    }
    const isUser = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not Found", "No user found!");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id: userId,
            // donorId: id,
        },
        data: {
            status: payload.status,
        },
    });
    return result;
});
const updateUserRole = (fullToken, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fullToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    // console.log(token);
    const [, token] = fullToken.split(" ");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    const isAdmin = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
            role: "ADMIN",
        },
    });
    if (!isAdmin) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not Found", "Not able to update any information!");
    }
    const isUser = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not Found", "No user found!");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id: userId,
            // donorId: id,
        },
        data: {
            role: payload.role,
        },
    });
    return result;
});
const getAllUserForAdmin = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = pagination_1.pagination.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // Search term conditions
    if (filters.searchTerm) {
        const searchTermConditions = user_constant_1.userSearchAbleFields
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
            if (key === "availability") {
                return {
                    [key]: {
                        equals: value === "true",
                    },
                };
            }
            else if (key === "bloodType") {
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
    // Sorting conditions
    const sortConditions = [];
    if (options.sortBy) {
        if (options.sortBy === "name") {
            sortConditions.push({ [options.sortBy]: options.sortOrder || "asc" });
        }
        else if (options.sortBy === "age" ||
            options.sortBy === "lastDonationDate") {
            sortConditions.push({
                profile: { [options.sortBy]: options.sortOrder || "asc" },
            });
        }
    }
    else {
        sortConditions.push({ createdAt: "desc" });
    }
    const result = yield prisma_1.default.user.findMany({
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
    const total = yield prisma_1.default.user.count({
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
exports.userServices = {
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
