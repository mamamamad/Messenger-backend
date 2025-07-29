import Application from "./Application.mjs";
import { log } from "./core/utils.mjs";

function main() {
  try {
    Application.run();
  } catch (e) {
    log(e);
  }
}

main();
