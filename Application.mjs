/**
 * application.mjs
 * ---------------
 * Main Application class for initializing and running the Express server.
 * Sets up middleware, routes, CORS, and error handling.
 */

import express from "express";
import { log } from "./core/utils.mjs";
import Approute from "./routes/route.mjs";
import cors from "cors";
import Error404 from "./controller/Error404Controller.mjs";
import Error500 from "./controller/Error500Controller.mjs";
import cookieParser from "cookie-parser";

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
  constructor() {
    this.#initExpress();
    this.#initCors();
    this.#initRoutes();
  }

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
  }

  /**
   * Sets up application routes and error handlers.
   * @private
   */
  async #initRoutes() {
    this.#app.use("/", Approute);
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
        origin: "http://localhost:3000",
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
  async run() {
    this.#app.listen(3001, async () => {
      log("listen on port 3001");
    });
  }
}

export default new Application();
