import { Router } from "express";
import userRoute from "./user.mjs";

const route = Router();

route.use("/user", userRoute);

export default route;
