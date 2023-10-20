import cors from "cors";
import express, { Express } from "express";
import authRouter from "./routers/authRouter";
import cookieParser from "cookie-parser";

const App: Express = express();

// configuration of express server
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(cookieParser());
App.use(cors());

// Routing Start

App.use("/api", authRouter);

// app running on port 8000 defined in env
App.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
