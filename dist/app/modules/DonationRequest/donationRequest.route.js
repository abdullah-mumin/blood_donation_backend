"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const donationRequest_controller_1 = require("./donationRequest.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const donationRequest_validation_1 = require("./donationRequest.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
//call controller function
router.post("/donor", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validationRequest_1.default)(donationRequest_validation_1.donationRequestValidation.createDonationReuqestValidationRequest), donationRequest_controller_1.donationRequestController.donationRequestCreateInDB);
router.post("/requester", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validationRequest_1.default)(donationRequest_validation_1.donationRequestValidation.createDonationReuqestWithUserIDValidationRequest), donationRequest_controller_1.donationRequestController.donationRequestWithUserID);
router.get("/me", donationRequest_controller_1.donationRequestController.getMyDonation);
router.get("/", donationRequest_controller_1.donationRequestController.getAllBloodRequest);
router.get("/history", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), donationRequest_controller_1.donationRequestController.getAllDonationHistory);
router.get("/request", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), donationRequest_controller_1.donationRequestController.getAllDonationRequest);
router.patch("/:requestId", (0, validationRequest_1.default)(donationRequest_validation_1.donationRequestValidation.updateDonationStatusValidationStatus), donationRequest_controller_1.donationRequestController.updateDonation);
exports.donationRequestRoutes = router;
