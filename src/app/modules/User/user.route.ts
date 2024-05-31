import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validationRequest";
import { userValidation } from "./user.validation";
const router = express.Router();

//call controller function
router.post(
  "/register",
  validateRequest(userValidation.registrationUserValidationSchema),
  userController.registrationUser
);

router.post(
  "/login",
  validateRequest(userValidation.loginUserValidationSchema),
  userController.loginUser
);

router.get("/donor-list", userController.getAllUser);

export const userRoutes = router;
