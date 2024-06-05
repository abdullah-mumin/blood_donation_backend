import express from "express";
import { donationRequestController } from "./donationRequest.controller";
import validateRequest from "../../middleware/validationRequest";
import { donationRequestValidation } from "./donationRequest.validation";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

//call controller function
router.post(
  "/donor",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(
    donationRequestValidation.createDonationReuqestValidationRequest
  ),
  donationRequestController.donationRequestCreateInDB
);

router.post(
  "/requester",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(
    donationRequestValidation.createDonationReuqestWithUserIDValidationRequest
  ),
  donationRequestController.donationRequestWithUserID
);

router.get("/me", donationRequestController.getMyDonation);
router.get("/", donationRequestController.getAllBloodRequest);
router.get(
  "/history",
  auth(UserRole.ADMIN, UserRole.USER),
  donationRequestController.getAllDonationHistory
);

router.get(
  "/request",
  auth(UserRole.ADMIN, UserRole.USER),
  donationRequestController.getAllDonationRequest
);

router.patch(
  "/:requestId",
  validateRequest(
    donationRequestValidation.updateDonationStatusValidationStatus
  ),
  donationRequestController.updateDonation
);

export const donationRequestRoutes = router;
