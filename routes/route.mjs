/**
 * route.mjs
 * ---------
 * Main router for the application.
 * Mounts all sub-routes.
 */

import { Router } from "express";
import userAuthRoute from "./userAuth.mjs";
import userProfileRoute from "./userProfile.mjs";

/**
 * Main application router.
 */
const route = Router();

route.use("/Auth", userAuthRoute);
route.use("/Profile", userProfileRoute);

export default route;
