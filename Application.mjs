import express from "express";
import { log } from "./core/utils.mjs";
import Approute from "./routes/route.mjs";
import cors from "cors";
import Error404 from "./controller/Error404Controller.mjs";
import Error500 from "./controller/Error500Controller.mjs";
class Application {
  #app = null;
  constructor() {
    this.#initExpress();
    this.#initCors();
    this.#initRoutes();
  }
  async #initExpress() {
    this.#app = express();
    this.#app.use(express.static("/asset"));
    this.#app.use(express.static("/media"));
    this.#app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.#app.use(express.json({ limit: "10mb" }));
  }
  async #initRoutes() {
    this.#app.use("/", Approute);
    this.#app.use(Error404.handle);
    this.#app.use(Error500.handle);
  }

  async #initCors() {
    this.#app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
  }

  async run() {
    this.#app.listen(3001, async () => {
      log("listen on port 3001");
    });
  }
}

export default new Application();
