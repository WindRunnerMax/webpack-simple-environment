import { Bind, sleep } from "@block-kit/utils";
import { Injectable, Scope } from "@nestjs/common";

import type { ParallelContext } from "../types/parallel";
import { ParallelScheduler } from "../utils/parallel";

@Injectable({ scope: Scope.DEFAULT })
export class TasksService {
  public scheduler: ParallelScheduler;
  public tasks: { id: string; status: "pending" | "running" | "success" | "fail" }[];

  public constructor() {
    this.tasks = [];
    this.scheduler = new ParallelScheduler("key", 2);
    this.scheduler.onRunning = this.onRunning;
  }

  public async createTask() {
    const id = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.tasks.push({ id, status: "pending" });
    return { id };
  }

  @Bind
  private async onRunning(context: ParallelContext) {
    const task = await this.findAndModify({ status: "pending" }, "running");
    if (!task) return void 0;
    // 存在任务的情况下, 尝试触发下一个并行任务
    context.tryNextTask();
    const now = Date.now();
    let taskIsFinished = false;
    const execute = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 3000));
        if (taskIsFinished) return void 0;
        taskIsFinished = true;
        await this.findAndModify({ id: task.id, status: "running" }, "success");
        console.log(`Task ${task.id} cost ${Date.now() - now} ms.`);
      } catch (error) {
        await this.findAndModify({ id: task.id, status: "running" }, "fail");
        console.log("Task", task.id, "is fail.", error);
      }
    };
    const timeout = async (ms: number) => {
      await sleep(ms);
      if (taskIsFinished) return void 0;
      taskIsFinished = true;
      await this.findAndModify({ id: task.id, status: "running" }, "fail");
    };
    await Promise.race([execute(), timeout(2000)]);
    return true;
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
