import express from "express";
import { donationRequestController } from "./donationRequest.controller";
import validateRequest from "../../middleware/validationRequest";
import { donationRequestValidation } from "./donationRequest.validation";
const router = express.Router();

//call controller function
router.post(
  "/",
  validateRequest(
    donationRequestValidation.createDonationReuqestValidationRequest
  ),
  donationRequestController.donationRequestCreateInDB
);

router.get("/", donationRequestController.getMyDonation);

router.put(
  "/:requestId",
  validateRequest(
    donationRequestValidation.updateDonationStatusValidationStatus
  ),
  donationRequestController.updateDonation
);

export const donationRequestRoutes = router;
