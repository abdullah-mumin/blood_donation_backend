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
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        //authorization check
        const fullToken = req.headers.authorization;
        //check if the token is sent from client
        if (!fullToken) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
        }
        // console.log(token);
        const [, token] = fullToken.split(" ");
        // console.log(token);
        //check if the token is valid
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
        // console.log(decoded);
        const { id, name, role, email } = decoded;
        //   console.log(id, name, email);
        const userInfo = yield prisma_1.default.user.findUnique({
            where: {
                id: id,
                email: email,
            },
        });
        if (!userInfo) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not Found", "User is not found!");
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "You do not have the necessary permissions to access this resource.");
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
