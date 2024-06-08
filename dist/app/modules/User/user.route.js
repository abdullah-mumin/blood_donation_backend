"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
//call controller function
router.post("/register", (0, validationRequest_1.default)(user_validation_1.userValidation.registrationUserValidationSchema), user_controller_1.userController.registrationUser);
router.post("/login", (0, validationRequest_1.default)(user_validation_1.userValidation.loginUserValidationSchema), user_controller_1.userController.loginUser);
router.post("/refresh-token", (0, validationRequest_1.default)(user_validation_1.userValidation.refreshTokenValidationSchema), user_controller_1.userController.refreshToken);
router.post("/change-password", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), user_controller_1.userController.changePassword);
router.patch("/user-status/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userController.updateUserStatus);
router.patch("/user-role/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userController.updateUserRole);
router.get("/donor-list", user_controller_1.userController.getAllUser);
router.get("/users", user_controller_1.userController.getAllUserForAdmin);
router.get("/donor-info/:id", user_controller_1.userController.singleBloodDonorByID);
exports.userRoutes = router;
