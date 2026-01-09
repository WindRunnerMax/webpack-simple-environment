import { Controller, Get, Inject, Post } from "@nestjs/common";

import { IndexService } from "../service";
import { TasksService } from "../service/tasks";

@Controller()
export class IndexController {
  @Inject(IndexService)
  private readonly indexService!: IndexService;

  @Inject(TasksService)
  private readonly tasksService!: TasksService;

  @Get()
  public index() {
    return this.indexService.getIndex();
  }

  @Get("/test")
  public test() {
    return { path: "/test" };
  }

  @Post("batch-create-task")
  public async createTask() {
    // curl -X POST http://localhost:3000/batch-create-task
    for (let i = 0; i < 5; i++) {
      this.tasksService.createTask();
    }
    this.tasksService.scheduler.tryBatchRun();
  }
}
