import { Module } from "@nestjs/common";

import { IndexController } from "./controller/index";
import { IndexService } from "./service/index";

// https://docs.nestjs.com/modules
@Module({
  imports: [],
  controllers: [IndexController],
  providers: [IndexService],
})
export class AppModule {}
