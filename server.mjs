import Application from "./Application.mjs";
import CryptoController from "./core/crypto.mjs";
import { log, getEnv } from "./core/utils.mjs";

function main() {
  try {
    Application.run();

    let x = CryptoController.encrypt(
      "hdadadaddkafsjkfbsjbfasfsfafsdfafdsggsvn sm,bf,mbasm,dnamdnsmfans,fbnsmfbsfbsann"
    );
    let y = CryptoController.decrypt(x);
    log(x);
    log(y);
  } catch (e) {
    log("12");
    log(e);
  }
}

main();
