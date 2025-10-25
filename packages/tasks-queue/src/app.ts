import { Module } from "@nestjs/common";

import { AppController } from "./controller";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
