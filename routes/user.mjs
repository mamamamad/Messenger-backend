import { Router } from "express";
import userLoginValidate from "../midlleware/userLoginValidate.mjs";
import Usercontroller from "../controller/Usercontroller.mjs";

const route = Router();
route.get("/login", userLoginValidate, (req, res) => {
  // log(req.body);
  return res.send("dada");
});

route.post("/login", userLoginValidate, (req, res) =>
  Usercontroller.userLogin(req, res)
);

export default route;
