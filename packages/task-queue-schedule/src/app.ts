import { Module } from "@nestjs/common";

import { IndexController } from "./controller/index";
import { IndexService } from "./service/index";
import { TasksService } from "./service/tasks";

// https://docs.nestjs.com/modules
@Module({
  imports: [],
  controllers: [IndexController],
  providers: [IndexService, TasksService],
})
export class AppModule {}
