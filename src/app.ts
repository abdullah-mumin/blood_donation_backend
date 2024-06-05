import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorhandler from "./app/middleware/globalErrorHandler";
const app: Application = express();

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());

//application request
app.use("/api", router);

const getAController = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Blood Donation API Collection",
  });
};
app.get("/", getAController);

app.use(globalErrorhandler);

export default app;
