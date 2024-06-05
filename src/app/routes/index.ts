import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { donationRequestRoutes } from "../modules/DonationRequest/donationRequest.route";
import { profileRoutes } from "../modules/Profile/profile.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/donation-request",
    route: donationRequestRoutes,
  },
  {
    path: "/profile",
    route: profileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
