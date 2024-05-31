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
const getMyProfile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
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
            location: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
            profile: true,
        },
    });
    return result;
});
const updateProfile = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    const { id, name, email } = decoded;
    const isUser = yield prisma_1.default.profile.findUnique({
        where: {
            userId: id,
        },
    });
    if (!isUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Error", "User not found!");
    }
    const result = yield prisma_1.default.profile.update({
        where: {
            userId: id,
        },
        data: payload,
    });
    return result;
});
exports.profileServices = {
    getMyProfile,
    updateProfile,
};
