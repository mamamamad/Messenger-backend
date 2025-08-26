import dateJalali from "moment-jalaali";
import moment from "moment";
import momentTimezone from "moment-timezone";

import { log, getEnv } from "./utils.mjs";

class timeDate {
  #timeZone = null;
  constructor() {
    this.#timeZone = getEnv("TIME_ZONE");
  }

  timeNow() {
    try {
      return moment.tz(this.#timeZone).format();
    } catch (e) {
      log(e);
    }
  }
  timeToTimeZone(time) {
    try {
      return moment(time).tz(this.#timeZone).format("YYYY-MM-DD HH:mm:ss");
    } catch (e) {
      log(e);
    }
  }
}

export default new timeDate();
