import { Bind, sleep } from "@block-kit/utils";
import { Injectable, Scope } from "@nestjs/common";

import { TaskQueue } from "../utils/task-queue";

@Injectable({ scope: Scope.DEFAULT })
export class TasksService {
  public queue: TaskQueue;
  public tasks: { id: string; status: "pending" | "running" | "success" | "fail" }[];

  public constructor() {
    this.tasks = [];
    this.queue = new TaskQueue("key", 2);
    this.queue.onRunning = this.onRunning;
  }

  public async createTask() {
    const id = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.tasks.push({ id, status: "pending" });
    return { id };
  }

  @Bind
  private async onRunning() {
    const task = await this.findAndModify({ status: "pending" }, "running");
    if (!task) return void 0;
    const now = Date.now();
    const execute = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 3000));
        await this.findAndModify({ id: task.id, status: "running" }, "success");
        console.log(`Task ${task.id} cost ${Date.now() - now} ms.`);
      } catch (error) {
        await this.findAndModify({ id: task.id, status: "running" }, "fail");
        console.log("Task", task.id, "is fail.", error);
      }
    };
    const timeout = async (ms: number) => {
      await sleep(ms);
      await this.findAndModify({ id: task.id, status: "running" }, "fail");
    };
    await Promise.all([execute(), timeout(2000)]);
    return task.id;
  }

  private async findAndModify(
    find: { id?: string; status?: typeof TasksService.prototype.tasks[0]["status"] } = {},
    status: typeof TasksService.prototype.tasks[0]["status"]
  ) {
    const task = this.tasks.find(t => {
      if (find.id && t.id !== find.id) return false;
      if (find.status && t.status !== find.status) return false;
      return true;
    });
    if (task) {
      console.log(`Task ${task.id} is ${task.status} => ${status}.`);
      task.status = status;
      return task;
    }
    return null;
  }
}
