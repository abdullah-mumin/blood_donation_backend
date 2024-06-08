"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const donationRequest_route_1 = require("../modules/DonationRequest/donationRequest.route");
const profile_route_1 = require("../modules/Profile/profile.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: user_route_1.userRoutes,
    },
    {
        path: "/donation-request",
        route: donationRequest_route_1.donationRequestRoutes,
    },
    {
        path: "/profile",
        route: profile_route_1.profileRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
