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
                availability: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        const userProfile = {
            userId: userInfo.id,
            bio: payload.bio,
            age: payload.age,
            lastDonationDate: payload.lastDonationDate,
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
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!", "Error");
    }
    const isCorrectPassword = yield bcrypt.compare(payload.password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect!", "Error");
    }
    const { id, name, email } = isUserExist;
    const jwtpayload = {
        id: id,
        name: name,
        email: email,
    };
    const token = (0, user_utils_1.createToken)(jwtpayload, config_1.default.jwt_access_token, config_1.default.jwt_access_expires_in);
    const data = {
        id,
        name,
        email,
        token,
    };
    return data;
});
const getAllUser = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
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
    getAllUser,
};
