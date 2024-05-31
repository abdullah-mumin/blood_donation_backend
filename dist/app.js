"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const app = (0, express_1.default)();
const corsConfig = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(corsConfig));
app.options("", (0, cors_1.default)(corsConfig));
app.use((0, cookie_parser_1.default)());
//application request
app.use("/api", routes_1.default);
const getAController = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Blood Donation API Collection",
    });
};
app.get("/", getAController);
app.use(globalErrorHandler_1.default);
exports.default = app;
