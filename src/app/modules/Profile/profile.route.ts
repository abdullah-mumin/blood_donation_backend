import express from "express";
import { profileController } from "./profile.controller";
import validateRequest from "../../middleware/validationRequest";
import { profileValidation } from "./profile.validation";
const router = express.Router();

//call controller function
router.get("/", profileController.getMyProfile);
router.put(
  "/",
  validateRequest(profileValidation.profilevalidationSchema),
  profileController.updateProfile
);

export const profileRoutes = router;
