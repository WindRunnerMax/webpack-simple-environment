import { Controller, Get, Inject } from "@nestjs/common";

import { IndexService } from "../service";

@Controller()
export class IndexController {
  @Inject(IndexService)
  private readonly indexService!: IndexService;

  @Get()
  public index() {
    return this.indexService.getIndex();
  }

  @Get("/test")
  public test() {
    return { path: "/test" };
  }
}
