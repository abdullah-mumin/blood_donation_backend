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
const router = express_1.default.Router();
//call controller function
router.post("/register", (0, validationRequest_1.default)(user_validation_1.userValidation.registrationUserValidationSchema), user_controller_1.userController.registrationUser);
router.post("/login", (0, validationRequest_1.default)(user_validation_1.userValidation.loginUserValidationSchema), user_controller_1.userController.loginUser);
router.get("/donor-list", user_controller_1.userController.getAllUser);
exports.userRoutes = router;
