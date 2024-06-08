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
exports.profileServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getMyProfile = (fullToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fullToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    const [, token] = fullToken.split(" ");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            bloodType: true,
            status: true,
            location: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
            profile: true,
        },
    });
    return result;
});
const updateProfile = (fullToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Error", "User not found!");
    }
    // console.log(payload);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const profileData = {
            bio: payload === null || payload === void 0 ? void 0 : payload.bio,
            age: payload === null || payload === void 0 ? void 0 : payload.age,
            lastDonationDate: payload === null || payload === void 0 ? void 0 : payload.lastDonationDate,
        };
        const userData = {
            name: payload === null || payload === void 0 ? void 0 : payload.name,
            location: payload === null || payload === void 0 ? void 0 : payload.location,
            bloodType: payload === null || payload === void 0 ? void 0 : payload.bloodType,
            availability: payload === null || payload === void 0 ? void 0 : payload.availability,
            status: payload === null || payload === void 0 ? void 0 : payload.status,
        };
        const profileUpdateData = yield transactionClient.profile.update({
            where: {
                userId: id,
            },
            data: profileData,
        });
        const userUpdateData = yield transactionClient.user.update({
            where: {
                id: id,
            },
            data: userData,
        });
        return { profileUpdateData, userUpdateData };
    }));
    return result;
});
exports.profileServices = {
    getMyProfile,
    updateProfile,
};
