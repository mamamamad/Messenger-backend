/**
 * server.mjs
 * ----------
 * Entry point for the Messenger backend application.
 * Initializes and runs the Express server, and demonstrates encryption/decryption.
 */

import Application from "./Application.mjs";
import { log, getEnv, randomNum } from "./core/utils.mjs";
import redis from "./core/redis.mjs";


/**
 * Main function to start the application and demonstrate crypto usage.
 */
async function main() {
  try {
    // Start the Express application
    Application.run();
    // log(await redis.redis1.keys("A*"));
  } catch (e) {
    log("12");
    log(e);
  }
}

main();
