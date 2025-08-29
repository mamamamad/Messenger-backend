/**
 * route.mjs
 * ---------
 * Main router for the application.
 * Mounts all sub-routes.
 */

import { Router } from "express";
import userAuthRoute from "./userAuth.mjs";
import userProfileRoute from "./userProfile.mjs";
import chat from "./chat.mjs";

/**
 * Main application router.
 */
const route = Router();
route.get("/test", (req, res) => {
  res.json({ msg: "hi sisi" });
});
route.use("/Auth", userAuthRoute);
route.use("/Profile", userProfileRoute);
route.use("/Chat", chat);

export default route;
