import Mondb from "./core/mongoDb.mjs";
import Usermodel from "./model/userModel.mjs";
import Adminmodel from "./model/adminModel.mjs";
import messageModel from "./model/messageModel.mjs";
import QueueWorker from "./workers/QueueWorker.mjs";
const MongoObjecctdb = new Mondb();
const userModelObj = new Usermodel();
const adminModelObj = new Adminmodel();
const messageModelObj = new messageModel();
const messageQueue = new QueueWorker("Message");
await messageQueue.saveMessageProcces();

export {
  MongoObjecctdb as MongoDb,
  userModelObj as UserModel,
  adminModelObj as AdminModel,
  messageQueue,
  messageModelObj as messageModel,
};
