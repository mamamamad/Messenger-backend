/**
 * route.mjs
 * ---------
 * Main router for the application.
 * Mounts all sub-routes.
 */

import { Router } from "express";
import userRoute from "./user.mjs";

/**
 * Main application router.
 */
const route = Router();

route.use("/user", userRoute);

export default route;
