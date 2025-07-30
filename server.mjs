/**
 * server.mjs
 * ----------
 * Entry point for the Messenger backend application.
 * Initializes and runs the Express server, and demonstrates encryption/decryption.
 */

import Application from "./Application.mjs";
import CryptoController from "./core/crypto.mjs";
import { log, getEnv } from "./core/utils.mjs";

/**
 * Main function to start the application and demonstrate crypto usage.
 */
function main() {
  try {
    // Start the Express application
    Application.run();

    // Example: Encrypt and decrypt a sample string
    let x = CryptoController.encrypt(
      "hdadadaddkafsjkfbsjbfasfsfafsdfafdsggsvn sm,bf,mbasm,dnamdnsmfans,fbnsmfbsfbsann"
    );
    let y = CryptoController.decrypt(x);
    log(x); // Log encrypted string
    log(y); // Log decrypted string
  } catch (e) {
    log("12");
    log(e);
  }
}

// Run the main function
main();
