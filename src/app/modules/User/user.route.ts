import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validationRequest";
import { userValidation } from "./user.validation";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
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

router.post(
  "/refresh-token",
  validateRequest(userValidation.refreshTokenValidationSchema),
  userController.refreshToken
);

router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.USER),
  userController.changePassword
);

router.patch(
  "/user-status/:id",
  auth(UserRole.ADMIN),
  userController.updateUserStatus
);

router.patch(
  "/user-role/:id",
  auth(UserRole.ADMIN),
  userController.updateUserRole
);

router.get("/donor-list", userController.getAllUser);
router.get("/users", userController.getAllUserForAdmin);

router.get("/donor-info/:id", userController.singleBloodDonorByID);

export const userRoutes = router;
