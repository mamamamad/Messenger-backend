import Mondb from "./core/mongoDb.mjs";
import Usermodel from "./model/userModel.mjs";
const MongoObjecctdb = new Mondb();
const userModelObj = new Usermodel();

export { MongoObjecctdb as MongoDb, userModelObj as UserModel };
