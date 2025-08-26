import Queue from "bull";
import { log, getEnv } from "../core/utils.mjs";
import { messageModel } from "../globalMoudles.mjs";

export default class QueueWorker {
  constructor(name) {
    try {
      this.name = name;
      this.queue = new Queue(name, getEnv("REDIS_URI"));
    } catch (e) {
      log(e);
    }
  }
  async addToQueue(data) {
    try {
      const job = await this.queue.add(this.name, data, {
        removeOnComplete: true, // بعد از انجام کار، پاک شود
        removeOnFail: false, // در صورت خطا باقی بماند برای بررسی
      });
      // log(job);
    } catch (e) {
      log(e);
    }
  }
  async saveMessageProcces() {
    try {
      this.queue.process(this.name, async (job) => {
        // log(JSON.parse(job.data));
        try {
          await messageModel.addMessage(JSON.parse(job.data));
          return {
            status: "ok",
            message: `the ${JSON.parse(job.data).message} added to db`,
          }; // این میشه result
        } catch (e) {
          log(e);
        }
      });
      this.queue.on("completed", (job, result) => {});

      // Event listener for failed jobs
      this.queue.on("failed", (job, err) => {
        console.error(`Job ID ${job.id} failed with error:`, err);
      });
    } catch (e) {
      log(e);
    }
  }
}
