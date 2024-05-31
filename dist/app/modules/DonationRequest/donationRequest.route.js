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
const router = express_1.default.Router();
//call controller function
router.post("/", (0, validationRequest_1.default)(donationRequest_validation_1.donationRequestValidation.createDonationReuqestValidationRequest), donationRequest_controller_1.donationRequestController.donationRequestCreateInDB);
router.get("/", donationRequest_controller_1.donationRequestController.getMyDonation);
router.put("/:requestId", (0, validationRequest_1.default)(donationRequest_validation_1.donationRequestValidation.updateDonationStatusValidationStatus), donationRequest_controller_1.donationRequestController.updateDonation);
exports.donationRequestRoutes = router;
