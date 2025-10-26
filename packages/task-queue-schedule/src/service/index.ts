import { Injectable } from "@nestjs/common";

@Injectable()
export class IndexService {
  public getIndex() {
    return { index: "hello" };
  }
}
