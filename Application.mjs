/**
 * application.mjs
 * ---------------
 * Main Application class for initializing and running the Express server.
 * Sets up middleware, routes, CORS, and error handling.
 */

import { MongoDb, UserModel } from "./globalMoudles.mjs";

import express from "express";
import { log, getEnv } from "./core/utils.mjs";
import Approute from "./routes/route.mjs";
import cors from "cors";
import Error404 from "./controller/Error404Controller.mjs";
import Error500 from "./controller/Error500Controller.mjs";
import cookieParser from "cookie-parser";
import sw from "./core/swagger.mjs";
import swaggerUi from "swagger-ui-express";
/**
 * Application
 * -----------
 * Encapsulates Express app setup and server start logic.
 */
class Application {
  #app = null;

  /**
   * Initializes the application by setting up Express, CORS, and routes.
   */

  /**
   * Initializes the Express app and middleware for static files and body parsing.
   * @private
   */
  async #initExpress() {
    this.#app = express();
    this.#app.use(express.static("/asset"));
    this.#app.use(express.static("/media"));
    this.#app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.#app.use(express.json({ limit: "10mb" }));
    this.#app.use(cookieParser());
    this.#app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(sw));
  }

  /**
   * Sets up application routes and error handlers.
   * @private
   */
  async #initRoutes() {
    this.#app.use("/api", Approute);
    this.#app.use(Error404.handle);
    this.#app.use(Error500.handle);
  }

  /**
   * Configures CORS for the application.
   * @private
   */
  async #initCors() {
    this.#app.use(
      cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
  }

  /**
   * Starts the Express server on port 3001.
   * Logs a message when the server is running.
   */
  async #init() {
    try {
      const result = await MongoDb.init(getEnv("MONGO_DB_URL"));
      if (result) {
        // log(MongoDb.db);
        log("mongo db is connect");
      } else {
        log("mongo db is not connect.");
        process.exit(-1);
      }
      await UserModel.init();
      await this.#initExpress();
      await this.#initCors();
      await this.#initRoutes();
    } catch (e) {
      log(e);
    }
  }
  async run() {
    try {
      await this.#init();
      this.#app.listen(3001, async () => {
        log("listen on port 3001");
      });
    } catch (e) {
      log(e);
    }
  }
}

export default Application;
