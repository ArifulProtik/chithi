// make a express router

import express from "express";
import { healthcehck } from "../controllers/controller";
import { Signin, Signout, Signup } from "../controllers/authController";
import { isAuth } from "../middlewares/isAuth";

const authRouter = express.Router();

authRouter.get("/healthcheck", healthcehck);
authRouter.post("/signup", Signup);
authRouter.post("/signin", Signin);
authRouter.get("/signout", isAuth, Signout);

export default authRouter;
