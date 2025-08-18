/**
 * server.mjs
 * ----------
 * Entry point for the Messenger backend application.
 * Initializes and runs the Express server, and demonstrates encryption/decryption.
 */

import Application from "./Application.mjs";
import { log } from "./core/utils.mjs";

/**
 * Main function to start the application and demonstrate crypto usage.
 */
async function main() {
  try {
    // Start the Express application
    const app = new Application();
    await app.run();
    // log(await redis.redis1.keys("A*"));
  } catch (e) {
    log("12");
    log(e);
  }
}

await main();
