"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("./profile.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const profile_validation_1 = require("./profile.validation");
const router = express_1.default.Router();
//call controller function
router.get("/", profile_controller_1.profileController.getMyProfile);
router.put("/", (0, validationRequest_1.default)(profile_validation_1.profileValidation.profilevalidationSchema), profile_controller_1.profileController.updateProfile);
exports.profileRoutes = router;
